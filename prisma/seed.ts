import { PrismaClient, PlatformRole, CourseStatus, RequirementPeriod } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- State + categories (Georgia DECAL) ----
  const georgia = await prisma.state.upsert({
    where: { code: "GA" },
    update: {},
    create: { code: "GA", name: "Georgia" },
  });

  const categoryDefs = [
    { code: "CGD", name: "Child Growth and Development" },
    { code: "HS", name: "Health and Safety" },
    { code: "CD", name: "Culture and Diversity" },
    { code: "BA", name: "Business Administration" },
  ];

  const categories: Record<string, { id: string }> = {};
  for (const def of categoryDefs) {
    categories[def.code] = await prisma.stateCategory.upsert({
      where: { stateCode_code: { stateCode: "GA", code: def.code } },
      update: {},
      create: { stateCode: "GA", code: def.code, name: def.name },
    });
  }

  // ---- Compliance requirements (DECAL: 10 hrs/year all staff, +2 hrs literacy) ----
  await prisma.complianceRequirement.deleteMany({ where: { stateCode: "GA" } });
  await prisma.complianceRequirement.createMany({
    data: [
      {
        stateCode: "GA",
        appliesToRole: PlatformRole.TEACHER,
        minHours: 10,
        period: RequirementPeriod.CALENDAR_YEAR,
        description: "Annual training — all caregiver staff (DECAL minimum)",
      },
      {
        stateCode: "GA",
        appliesToRole: PlatformRole.DIRECTOR,
        minHours: 10,
        period: RequirementPeriod.CALENDAR_YEAR,
        description: "Annual training — directors (DECAL minimum)",
      },
      {
        stateCode: "GA",
        stateCategoryId: categories.CGD.id,
        appliesToRole: PlatformRole.TEACHER,
        minHours: 2,
        period: RequirementPeriod.CALENDAR_YEAR,
        description: "Evidence-based language & literacy practices (DECAL sub-requirement)",
      },
    ],
  });

  // ---- Organization / Center ----
  const org = await prisma.organization.upsert({
    where: { id: "seed-org-1" },
    update: {},
    create: { id: "seed-org-1", name: "Sunrise Learning Centers" },
  });

  const center = await prisma.center.upsert({
    where: { id: "seed-center-1" },
    update: {},
    create: {
      id: "seed-center-1",
      organizationId: org.id,
      name: "Sunrise Learning Center — Decatur",
      stateCode: "GA",
      licenseNumber: "GA-CCLC-000123",
      address: "123 Peachtree St, Decatur, GA",
    },
  });

  // ---- Users ----
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@sunrise.example" },
    update: {},
    create: {
      email: "owner@sunrise.example",
      name: "Olivia Owner",
      passwordHash,
      platformRole: PlatformRole.OWNER,
      organizationId: org.id,
    },
  });

  const director = await prisma.user.upsert({
    where: { email: "director@sunrise.example" },
    update: {},
    create: {
      email: "director@sunrise.example",
      name: "Diana Director",
      passwordHash,
      platformRole: PlatformRole.DIRECTOR,
      organizationId: org.id,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@sunrise.example" },
    update: {},
    create: {
      email: "teacher@sunrise.example",
      name: "Teresa Teacher",
      passwordHash,
      platformRole: PlatformRole.TEACHER,
      organizationId: org.id,
      preferredLocale: "es",
    },
  });

  for (const [user, role] of [
    [director, PlatformRole.DIRECTOR],
    [teacher, PlatformRole.TEACHER],
  ] as const) {
    await prisma.centerStaff.upsert({
      where: { userId_centerId: { userId: user.id, centerId: center.id } },
      update: {},
      create: { userId: user.id, centerId: center.id, role },
    });
  }

  // State workforce registry IDs (required on certificates)
  await prisma.stateRegistryProfile.upsert({
    where: { userId_stateCode: { userId: teacher.id, stateCode: "GA" } },
    update: {},
    create: { userId: teacher.id, stateCode: "GA", registryId: "GAPDS-000456" },
  });
  await prisma.stateRegistryProfile.upsert({
    where: { userId_stateCode: { userId: director.id, stateCode: "GA" } },
    update: {},
    create: { userId: director.id, stateCode: "GA", registryId: "GAPDS-000789" },
  });

  // ---- Sample bilingual course: Health & Safety ----
  const course = await prisma.course.upsert({
    where: { id: "seed-course-health-safety" },
    update: {},
    create: {
      id: "seed-course-health-safety",
      title: "Preventing Illness in Group Care Settings",
      description:
        "A 2-hour course covering sanitation, illness exclusion policies, and outbreak prevention in licensed child care settings.",
      status: CourseStatus.PUBLISHED,
      clockHours: 2,
    },
  });

  await prisma.courseTranslation.upsert({
    where: { courseId_locale: { courseId: course.id, locale: "es" } },
    update: {},
    create: {
      courseId: course.id,
      locale: "es",
      title: "Prevención de Enfermedades en Entornos de Cuidado Grupal",
      description:
        "Un curso de 2 horas sobre saneamiento, políticas de exclusión por enfermedad y prevención de brotes en centros de cuidado infantil con licencia.",
    },
  });

  await prisma.courseCategory.upsert({
    where: { courseId_stateCategoryId: { courseId: course.id, stateCategoryId: categories.HS.id } },
    update: {},
    create: { courseId: course.id, stateCategoryId: categories.HS.id },
  });

  await prisma.courseStateApproval.upsert({
    where: { courseId_stateCode: { courseId: course.id, stateCode: "GA" } },
    update: {},
    create: {
      courseId: course.id,
      stateCode: "GA",
      providerId: "GA-PROVIDER-00042",
      approvedCourseCode: "GA-HS-2026-017",
      approvedClockHours: 2,
      approvedAt: new Date("2026-01-15"),
      expiresAt: new Date("2028-01-15"),
      isActive: true,
    },
  });

  const module1 = await prisma.module.upsert({
    where: { id: "seed-module-1" },
    update: {},
    create: { id: "seed-module-1", courseId: course.id, title: "Sanitation Fundamentals", order: 1 },
  });

  const lesson1 = await prisma.lesson.upsert({
    where: { id: "seed-lesson-1" },
    update: {},
    create: {
      id: "seed-lesson-1",
      moduleId: module1.id,
      title: "Handwashing & Diapering Sanitation",
      order: 1,
      videoProvider: "cloudflare_stream",
      videoAssetId: "demo-asset-handwashing",
      durationSeconds: 480,
      bodyMarkdown: "Proper handwashing and diaper-changing sanitation reduces illness transmission by up to 50%.",
    },
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson1.id },
    update: {},
    create: {
      lessonId: lesson1.id,
      passThreshold: 80,
      questions: {
        create: [
          {
            order: 1,
            prompt: "How long should you wash hands to properly remove germs?",
            choices: ["5 seconds", "10 seconds", "20 seconds", "1 minute"],
            correctIndex: 2,
          },
          {
            order: 2,
            prompt: "Diaper-changing surfaces should be sanitized:",
            choices: [
              "Once per day",
              "After each diaper change",
              "Only if visibly soiled",
              "Once per week",
            ],
            correctIndex: 1,
          },
        ],
      },
    },
  });

  console.log("Seed complete:", {
    org: org.name,
    center: center.name,
    users: [owner.email, director.email, teacher.email],
    course: course.title,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
