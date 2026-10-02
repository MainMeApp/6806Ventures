// Property listings. To add a photo, drop it in public/properties/<slug>/
// named main.jpg (or .jpeg, .png, .webp). Any other images in that folder
// show up as a gallery on the property page. See README for details.
//
// TODO: every entry below is a placeholder. Replace names, streets, bed
// counts, and features with the real portfolio before launch.
//
// Keep availableBeds accurate: the "only N left" and waitlist messaging is
// driven by it, and overstating scarcity costs referral partners' trust.

// Update this date whenever availableBeds changes (YYYY-MM-DD).
export const availabilityUpdated = "2026-10-02";

// At or below this many open beds, a home is flagged as nearly full.
export const LOW_AVAILABILITY = 2;

export type Property = {
  slug: string;
  name: string;
  // Keep the exact street address off the public site until a tour is booked
  // if residents' privacy calls for it; the neighborhood alone is fine.
  neighborhood: string;
  street?: string;
  zip: string;
  totalBeds: number;
  availableBeds: number;
  bedrooms: number;
  bathrooms: number;
  summary: string;
  features: string[];
  nearby: string[];
};

export const properties: Property[] = [
  {
    slug: "residence-one",
    name: "West Atlanta Residence I",
    neighborhood: "West Atlanta",
    zip: "30314",
    totalBeds: 6,
    availableBeds: 2,
    bedrooms: 3,
    bathrooms: 2,
    summary:
      "A renovated single-family home with three shared bedrooms, an open kitchen, and a covered front porch.",
    features: ["Fully furnished", "Renovated kitchen", "Washer and dryer", "Front porch seating", "Smoke-free home"],
    nearby: ["MARTA bus stops within walking distance", "Grocery and pharmacy nearby", "Short ride to Downtown care providers"],
  },
  {
    slug: "residence-two",
    name: "West Atlanta Residence II",
    neighborhood: "West Atlanta",
    zip: "30314",
    totalBeds: 6,
    availableBeds: 1,
    bedrooms: 3,
    bathrooms: 2,
    summary:
      "A bright, single-level home with step-free entry, a shared living room, and a fenced backyard.",
    features: ["Fully furnished", "Single-level living", "Step-free entry", "Fenced backyard", "Smoke-free home"],
    nearby: ["MARTA rail access by bus", "Community park nearby", "Close to outpatient clinics"],
  },
  {
    slug: "residence-three",
    name: "West Atlanta Residence III",
    neighborhood: "West Atlanta",
    zip: "30314",
    totalBeds: 4,
    availableBeds: 0,
    bedrooms: 2,
    bathrooms: 1,
    summary:
      "A quiet, smaller home suited to residents who prefer a calmer household with fewer housemates.",
    features: ["Fully furnished", "Quiet street", "Shared dining area", "Off-street parking", "Smoke-free home"],
    nearby: ["MARTA bus stops within walking distance", "Corner market nearby", "Short ride to Grady Memorial"],
  },
];

export function getProperty(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export function totalAvailableBeds() {
  return properties.reduce((sum, p) => sum + p.availableBeds, 0);
}

export function totalBeds() {
  return properties.reduce((sum, p) => sum + p.totalBeds, 0);
}

export function formatAvailabilityDate() {
  return new Date(`${availabilityUpdated}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
