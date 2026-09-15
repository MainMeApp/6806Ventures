import { MockStateRegistryAdapter } from "./mock-base";
import { GeorgiaRegistryAdapter } from "./georgia";
import type { StateRegistryAdapter } from "./types";

const registry = new Map<string, StateRegistryAdapter>();
registry.set("GA", new GeorgiaRegistryAdapter());

/**
 * Returns the adapter for a given state, falling back to a generic mock so a brand
 * new state can be enabled for course-taking and certificate issuance immediately —
 * a dedicated adapter (with that state's registry ID format, category taxonomy quirks,
 * etc.) can be dropped in later without touching any calling code.
 */
export function getStateAdapter(stateCode: string): StateRegistryAdapter {
  const existing = registry.get(stateCode);
  if (existing) return existing;

  const fallback = new MockStateRegistryAdapter(stateCode);
  registry.set(stateCode, fallback);
  return fallback;
}

export type { StateRegistryAdapter } from "./types";
