import { MockStateRegistryAdapter } from "./mock-base";

/**
 * Georgia's workforce registry is GaPDS (Georgia Professional Development System),
 * administered by DECAL. Registry IDs there follow their own format; validation here
 * is tightened slightly beyond the generic mock to reflect that, but the sync calls
 * remain mocked until DECAL grants API access — swap the method bodies for real HTTP
 * calls when that partnership exists, the interface does not need to change.
 */
export class GeorgiaRegistryAdapter extends MockStateRegistryAdapter {
  constructor() {
    super("GA");
  }

  async verifyRegistryId(registryId: string): Promise<boolean> {
    return /^GAPDS-\d{6}$/.test(registryId.trim());
  }
}
