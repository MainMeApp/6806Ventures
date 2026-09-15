import { prisma } from "@/lib/prisma";
import { getStateAdapter } from "@/lib/state-adapters";

/** Pushes a just-issued certificate to its state's workforce registry and logs the attempt/result. */
export async function syncCertificateToRegistry(certificateId: string) {
  const certificate = await prisma.certificate.findUniqueOrThrow({
    where: { id: certificateId },
    include: { user: true },
  });

  const log = await prisma.registrySyncLog.create({
    data: {
      stateCode: certificate.stateCode,
      entityType: "certificate",
      entityId: certificate.id,
      payload: {
        certificateNumber: certificate.certificateNumber,
        providerId: certificate.providerId,
        approvedCourseCode: certificate.approvedCourseCode,
        clockHours: certificate.clockHours.toString(),
        registryId: certificate.registryId,
      },
      status: "PENDING",
    },
  });

  const adapter = getStateAdapter(certificate.stateCode);

  try {
    const result = await adapter.syncCertificateIssued({
      certificateNumber: certificate.certificateNumber,
      stateCode: certificate.stateCode,
      providerId: certificate.providerId,
      approvedCourseCode: certificate.approvedCourseCode,
      clockHours: Number(certificate.clockHours),
      registryId: certificate.registryId,
      studentName: certificate.user.name,
      issuedAt: certificate.issuedAt.toISOString(),
    });

    await prisma.registrySyncLog.update({
      where: { id: log.id },
      data: { status: result.status, respondedAt: new Date() },
    });

    return result;
  } catch (err) {
    await prisma.registrySyncLog.update({
      where: { id: log.id },
      data: { status: "FAILED", respondedAt: new Date() },
    });
    throw err;
  }
}
