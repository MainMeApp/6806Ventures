// Every state licensing agency runs its own workforce registry (Georgia's GaPDS,
// others on shared "Registry" infrastructure, some fully bespoke). Real integration
// requires an official partnership/API agreement per state — until that's signed for
// a given state, its adapter should implement the same interface against a mock
// endpoint so the rest of the platform (certificates, dashboards, exports) never has
// to know whether a state is "live" or "mocked".

export interface CertificateSyncPayload {
  certificateNumber: string;
  stateCode: string;
  providerId: string;
  approvedCourseCode: string;
  clockHours: number;
  registryId: string | null;
  studentName: string;
  issuedAt: string; // ISO date
}

export interface StaffProfileSyncPayload {
  registryId: string;
  stateCode: string;
  fullName: string;
  role: "DIRECTOR" | "TEACHER";
  centerLicenseNumber: string | null;
}

export interface RegistrySyncResult {
  status: "SENT" | "ACKNOWLEDGED" | "FAILED";
  externalReferenceId?: string;
  message?: string;
}

export interface StateRegistryAdapter {
  stateCode: string;
  /** Whether this state has a signed API partnership, or is running against a mock endpoint. */
  isLive: boolean;
  syncCertificateIssued(payload: CertificateSyncPayload): Promise<RegistrySyncResult>;
  syncStaffProfile(payload: StaffProfileSyncPayload): Promise<RegistrySyncResult>;
  verifyRegistryId(registryId: string): Promise<boolean>;
}
