import { prisma } from "@/lib/prisma";
import { PlatformRole, RequirementPeriod } from "@prisma/client";

export interface RequirementResult {
  requirementId: string;
  description: string;
  categoryCode: string | null;
  minHours: number;
  hoursCompleted: number;
  met: boolean;
}

export interface StaffComplianceResult {
  userId: string;
  name: string;
  role: PlatformRole;
  compliant: boolean;
  requirements: RequirementResult[];
}

export interface CenterComplianceResult {
  centerId: string;
  periodStart: Date;
  periodEnd: Date;
  score: number; // 0-100
  staffTotal: number;
  staffCompliant: number;
  staff: StaffComplianceResult[];
}

function getPeriodBounds(period: RequirementPeriod, now: Date = new Date()) {
  if (period === RequirementPeriod.CALENDAR_YEAR) {
    return {
      start: new Date(Date.UTC(now.getUTCFullYear(), 0, 1)),
      end: new Date(Date.UTC(now.getUTCFullYear(), 11, 31, 23, 59, 59)),
    };
  }
  // ROLLING_12_MONTH
  const end = now;
  const start = new Date(now);
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  return { start, end };
}

/**
 * Computes each active staff member's compliance against every requirement that
 * applies to their role in the center's state, for the requirement's own period
 * (a state can mix calendar-year and rolling-12-month requirements). The center's
 * overall score is the share of staff who are fully compliant across ALL of their
 * applicable requirements — a single missed sub-requirement (e.g. Georgia's 2-hour
 * literacy carve-out) fails the staff member even if their total hours clear 10.
 */
async function computeStaffRequirements(
  userId: string,
  role: PlatformRole,
  stateCode: string,
  now: Date
): Promise<RequirementResult[]> {
  const requirements = await prisma.complianceRequirement.findMany({
    where: { stateCode, appliesToRole: role },
    include: { stateCategory: true },
  });

  const requirementResults: RequirementResult[] = [];
  for (const req of requirements) {
    const { start, end } = getPeriodBounds(req.period, now);

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { gte: start, lte: end },
        ...(req.stateCategoryId
          ? { course: { categories: { some: { stateCategoryId: req.stateCategoryId } } } }
          : {}),
      },
      include: { course: true },
    });

    const hoursCompleted = enrollments.reduce((sum, e) => sum + Number(e.course.clockHours), 0);

    requirementResults.push({
      requirementId: req.id,
      description: req.description,
      categoryCode: req.stateCategory?.code ?? null,
      minHours: Number(req.minHours),
      hoursCompleted,
      met: hoursCompleted >= Number(req.minHours),
    });
  }
  return requirementResults;
}

/** Compliance for a single staff member — used by the teacher's own onboarding wizard. */
export async function computeUserCompliance(
  userId: string,
  centerId: string,
  now: Date = new Date()
): Promise<StaffComplianceResult> {
  const membership = await prisma.centerStaff.findFirstOrThrow({
    where: { userId, centerId, endedAt: null },
    include: { user: true, center: true },
  });

  const requirementResults = await computeStaffRequirements(
    userId,
    membership.role,
    membership.center.stateCode,
    now
  );

  return {
    userId,
    name: membership.user.name,
    role: membership.role,
    compliant: requirementResults.every((r) => r.met),
    requirements: requirementResults,
  };
}

export async function computeCenterCompliance(
  centerId: string,
  now: Date = new Date()
): Promise<CenterComplianceResult> {
  const center = await prisma.center.findUniqueOrThrow({
    where: { id: centerId },
    include: {
      staff: { where: { endedAt: null }, include: { user: true } },
    },
  });

  const staffResults: StaffComplianceResult[] = [];

  for (const membership of center.staff) {
    const requirementResults = await computeStaffRequirements(
      membership.userId,
      membership.role,
      center.stateCode,
      now
    );

    staffResults.push({
      userId: membership.userId,
      name: membership.user.name,
      role: membership.role,
      compliant: requirementResults.every((r) => r.met),
      requirements: requirementResults,
    });
  }

  const staffCompliant = staffResults.filter((s) => s.compliant).length;
  const score =
    staffResults.length === 0 ? 100 : Math.round((staffCompliant / staffResults.length) * 100);

  const { start, end } = getPeriodBounds(RequirementPeriod.CALENDAR_YEAR, now);

  return {
    centerId,
    periodStart: start,
    periodEnd: end,
    score,
    staffTotal: staffResults.length,
    staffCompliant,
    staff: staffResults,
  };
}

/** Computes and persists a snapshot so the dashboard can render instantly without recomputing live. */
export async function refreshComplianceSnapshot(centerId: string) {
  const result = await computeCenterCompliance(centerId);

  return prisma.complianceSnapshot.create({
    data: {
      centerId,
      periodStart: result.periodStart,
      periodEnd: result.periodEnd,
      score: result.score,
      staffTotal: result.staffTotal,
      staffCompliant: result.staffCompliant,
      details: JSON.parse(JSON.stringify(result.staff)),
    },
  });
}
