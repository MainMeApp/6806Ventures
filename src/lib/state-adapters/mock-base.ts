import type {
  CertificateSyncPayload,
  RegistrySyncResult,
  StaffProfileSyncPayload,
  StateRegistryAdapter,
} from "./types";

/**
 * Base implementation shared by every state until that state's licensing agency
 * grants an official API partnership. Simulates network latency and always
 * "acknowledges", so the rest of the app (dashboards, sync logs, exports) behaves
 * exactly as it will once a real endpoint is swapped in — only this class changes.
 */
export class MockStateRegistryAdapter implements StateRegistryAdapter {
  readonly isLive = false;

  constructor(public readonly stateCode: string) {}

  async syncCertificateIssued(payload: CertificateSyncPayload): Promise<RegistrySyncResult> {
    await simulateLatency();
    return {
      status: "ACKNOWLEDGED",
      externalReferenceId: `MOCK-${this.stateCode}-CERT-${payload.certificateNumber}`,
      message: `[mock] ${this.stateCode} registry would record certificate ${payload.certificateNumber} for registry ID ${payload.registryId ?? "UNVERIFIED"}.`,
    };
  }

  async syncStaffProfile(payload: StaffProfileSyncPayload): Promise<RegistrySyncResult> {
    await simulateLatency();
    return {
      status: "ACKNOWLEDGED",
      externalReferenceId: `MOCK-${this.stateCode}-STAFF-${payload.registryId}`,
      message: `[mock] ${this.stateCode} registry would update staff profile ${payload.registryId}.`,
    };
  }

  async verifyRegistryId(registryId: string): Promise<boolean> {
    await simulateLatency();
    // Mock validation: non-empty and matches a loose state-prefixed pattern.
    return registryId.trim().length >= 6;
  }
}

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 50));
}
