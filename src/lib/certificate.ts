import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { syncCertificateToRegistry } from "@/lib/registry-sync";
import path from "node:path";
import fs from "node:fs/promises";

const CERT_DIR = path.join(process.cwd(), "public", "certificates");

function generateCertificateNumber(stateCode: string) {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SC-${stateCode}-${stamp}-${rand}`;
}

async function renderCertificatePdf(data: {
  studentName: string;
  courseTitle: string;
  stateCode: string;
  providerId: string;
  approvedCourseCode: string;
  clockHours: number;
  registryId: string | null;
  certificateNumber: string;
  issuedAt: Date;
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([792, 612]); // landscape letter
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const navy = rgb(0.09, 0.16, 0.33);
  const gray = rgb(0.35, 0.38, 0.44);

  page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: navy, borderWidth: 3 });

  page.drawText("Certificate of Completion", {
    x: width / 2 - 190,
    y: height - 100,
    size: 28,
    font,
    color: navy,
  });

  page.drawText("SmartCare Compliance", {
    x: width / 2 - 90,
    y: height - 130,
    size: 14,
    font: bodyFont,
    color: gray,
  });

  page.drawText("This certifies that", {
    x: width / 2 - 65,
    y: height - 190,
    size: 12,
    font: bodyFont,
    color: gray,
  });

  page.drawText(data.studentName, {
    x: width / 2 - (data.studentName.length * 7),
    y: height - 220,
    size: 22,
    font,
    color: navy,
  });

  page.drawText("has successfully completed", {
    x: width / 2 - 90,
    y: height - 250,
    size: 12,
    font: bodyFont,
    color: gray,
  });

  page.drawText(data.courseTitle, {
    x: width / 2 - (data.courseTitle.length * 5),
    y: height - 280,
    size: 16,
    font,
    color: navy,
  });

  const detailLines = [
    `State: ${data.stateCode}`,
    `Provider ID: ${data.providerId}`,
    `Approved Course Code: ${data.approvedCourseCode}`,
    `Clock Hours Earned: ${data.clockHours.toFixed(2)}`,
    `Student Registry ID: ${data.registryId ?? "Not on file"}`,
    `Certificate Number: ${data.certificateNumber}`,
    `Issued: ${data.issuedAt.toLocaleDateString("en-US")}`,
  ];

  detailLines.forEach((line, i) => {
    page.drawText(line, {
      x: 80,
      y: 160 - i * 18,
      size: 11,
      font: bodyFont,
      color: gray,
    });
  });

  return pdf.save();
}

/**
 * Issues a certificate for a completed enrollment: looks up the course's active
 * state approval (Provider ID + approved course code), records the certificate,
 * renders the PDF, and pushes the issuance to that state's registry adapter.
 */
export async function issueCertificateForEnrollment(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUniqueOrThrow({
    where: { id: enrollmentId },
    include: { user: true, course: true, center: true, certificate: true },
  });

  if (enrollment.certificate) return enrollment.certificate;
  if (enrollment.status !== "COMPLETED") {
    throw new Error("Cannot issue a certificate for an incomplete enrollment.");
  }

  const stateCode = enrollment.center.stateCode;

  const approval = await prisma.courseStateApproval.findFirst({
    where: { courseId: enrollment.courseId, stateCode, isActive: true },
  });
  if (!approval) {
    throw new Error(
      `Course "${enrollment.course.title}" has no active approval in ${stateCode}; cannot issue a compliant certificate.`
    );
  }

  const registryProfile = await prisma.stateRegistryProfile.findUnique({
    where: { userId_stateCode: { userId: enrollment.userId, stateCode } },
  });

  const certificateNumber = generateCertificateNumber(stateCode);
  const issuedAt = new Date();

  const pdfBytes = await renderCertificatePdf({
    studentName: enrollment.user.name,
    courseTitle: enrollment.course.title,
    stateCode,
    providerId: approval.providerId,
    approvedCourseCode: approval.approvedCourseCode,
    clockHours: Number(approval.approvedClockHours),
    registryId: registryProfile?.registryId ?? null,
    certificateNumber,
    issuedAt,
  });

  await fs.mkdir(CERT_DIR, { recursive: true });
  const fileName = `${certificateNumber}.pdf`;
  await fs.writeFile(path.join(CERT_DIR, fileName), pdfBytes);

  const certificate = await prisma.certificate.create({
    data: {
      enrollmentId: enrollment.id,
      userId: enrollment.userId,
      certificateNumber,
      stateCode,
      providerId: approval.providerId,
      approvedCourseCode: approval.approvedCourseCode,
      clockHours: approval.approvedClockHours,
      registryId: registryProfile?.registryId ?? null,
      issuedAt,
      pdfPath: `/certificates/${fileName}`,
    },
  });

  await syncCertificateToRegistry(certificate.id).catch((err) => {
    // Registry sync failure shouldn't block certificate issuance — the sync log
    // already records the FAILED attempt for retry/inspection.
    console.error("Registry sync failed for certificate", certificate.id, err);
  });

  return certificate;
}
