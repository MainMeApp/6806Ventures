// Property listings. To add a photo, drop it in public/properties/<slug>/
// named main.jpg (or .jpeg, .png, .webp). Any other images in that folder
// show up as a gallery on the property page. See README for details.
//
// TODO: bed counts, bedrooms, and bathrooms below are still placeholders.
//
// Keep availableBeds accurate: the "only N left" and waitlist messaging is
// driven by it, and overstating scarcity costs referral partners' trust.
//
// Location facts in `getAround` were checked against the Atlanta Beltline,
// PATH Foundation, MARTA, and neighborhood sources. Keep them factual; do not
// add walking times without measuring them.

// Update this date whenever availableBeds changes (YYYY-MM-DD).
export const availabilityUpdated = "2026-10-07";

// At or below this many open beds, a home is flagged as nearly full.
export const LOW_AVAILABILITY = 2;

// Residents of supportive housing can be targets; by default the public site
// shows the street and neighborhood, and the house number is shared once a
// referral or tour is confirmed. Set to true to publish full addresses.
export const SHOW_HOUSE_NUMBERS = false;

export type GetAroundKind = "rail" | "bus" | "trail" | "park";

export type Property = {
  slug: string;
  name: string;
  address: string;
  streetName: string;
  neighborhood: string;
  zip: string;
  totalBeds: number;
  availableBeds: number;
  bedrooms: number;
  bathrooms: number;
  summary: string;
  // Describes main.* for screen readers; set it when the main photo is not the exterior.
  mainPhotoAlt?: string;
  features: string[];
  // Private rooms, separate from the shared beds (not counted in totalBeds).
  // Leave price out to show "Ask about pricing".
  privateRoom?: { count: number; price?: number; summary: string; features: string[] };
  getAround: { kind: GetAroundKind; title: string; detail: string }[];
};

const sharedFeatures = [
  "Fully furnished shared bedrooms",
  "All utilities and Wi-Fi included",
  "TV, personal Netflix account, and headphones",
  "Daily sanitizing by the house host",
  "Professional cleaning every two weeks",
];

export const properties: Property[] = [
  {
    slug: "chappell-road",
    name: "Chappell Road House",
    address: "64 Chappell Rd NW",
    streetName: "Chappell Rd NW",
    neighborhood: "Hunter Hills",
    zip: "30314",
    totalBeds: 6,
    availableBeds: 1,
    bedrooms: 3,
    bathrooms: 2,
    mainPhotoAlt: "Kitchen with a marble island, bar seating, and stainless steel appliances",
    privateRoom: {
      count: 1,
      price: 1800,
      summary:
        "One private room sits in the home's duplex side, with its own entrance and bathroom, for a resident who needs their own space.",
      features: [
        "Separate private entrance",
        "Private bathroom",
        "Kitchenette with sink, mini fridge, and cabinets",
        "Furnished bed with under-bed storage",
        "TV, personal Netflix account, and headphones",
      ],
    },
    summary:
      "A home just north of Martin Luther King Jr. Drive, where Hunter Hills meets Mozley Park and West Lake, close to the West Lake MARTA station and the Beltline's Westside Trail.",
    features: sharedFeatures,
    getAround: [
      {
        kind: "rail",
        title: "MARTA rail",
        detail: "West Lake station on the Blue Line is the closest rail stop, with direct trains to Downtown.",
      },
      {
        kind: "bus",
        title: "MARTA buses",
        detail: "Route 3 runs along Martin Luther King Jr. Dr to Five Points, and Route 51 runs along Joseph E. Boone Blvd.",
      },
      {
        kind: "trail",
        title: "Atlanta Beltline",
        detail: "The Westside Trail, which ends at West Lake station, is a short trip east through Mozley Park.",
      },
      {
        kind: "park",
        title: "Parks and trails",
        detail: "Mozley Park's recreation center, pool, and playing courts are nearby, joined to Washington Park by the Lionel Hampton Trail.",
      },
    ],
  },
  {
    slug: "chicamauga-avenue",
    name: "Chicamauga Avenue House",
    address: "223 Chicamauga Ave SW",
    streetName: "Chicamauga Ave SW",
    neighborhood: "Mozley Park",
    zip: "30314",
    totalBeds: 4,
    availableBeds: 0,
    bedrooms: 2,
    bathrooms: 1,
    mainPhotoAlt: "Kitchen with white cabinets, a side-by-side refrigerator, range, microwave, and dishwasher",
    // TODO: add price and room details for the two private rooms.
    privateRoom: {
      count: 2,
      summary: "Two private bedrooms for residents who need their own space, in addition to the shared rooms.",
      features: ["Private furnished bedroom", "TV, personal Netflix account, and headphones"],
    },
    summary:
      "A home in Chicamauga Heights, a historic pocket of Mozley Park, a few houses from an entrance to the Beltline's Westside Trail.",
    features: sharedFeatures,
    getAround: [
      {
        kind: "trail",
        title: "Atlanta Beltline",
        detail: "A Westside Trail entrance is a few houses away. Mozley Park has four direct entrances to the trail.",
      },
      {
        kind: "rail",
        title: "MARTA rail",
        detail: "West Lake station is the closest rail stop, and the Westside Trail leads to both West Lake and Ashby stations.",
      },
      {
        kind: "bus",
        title: "MARTA buses",
        detail: "Route 3 runs along Martin Luther King Jr. Dr, the neighborhood's northern edge, to Five Points.",
      },
      {
        kind: "park",
        title: "Mozley Park",
        detail: "A recreation center, public pool, dog park, playgrounds, and tennis and basketball courts.",
      },
    ],
  },
  {
    slug: "sharon-street",
    name: "Sharon Street House",
    address: "1370 Sharon St NW",
    streetName: "Sharon St NW",
    neighborhood: "Hunter Hills",
    zip: "30314",
    totalBeds: 6,
    availableBeds: 2,
    bedrooms: 3,
    bathrooms: 2,
    mainPhotoAlt: "Kitchen with blue-gray cabinets, white counters, subway tile, and stainless steel appliances",
    summary:
      "A home in Hunter Hills, a historic, tree-lined neighborhood between Joseph E. Boone Boulevard and Martin Luther King Jr. Drive, with Washington Park and the Beltline on its eastern edge.",
    features: sharedFeatures,
    getAround: [
      {
        kind: "rail",
        title: "MARTA rail",
        detail: "Ashby, West Lake, and Bankhead stations serve Hunter Hills, with direct trains to Downtown and Midtown.",
      },
      {
        kind: "bus",
        title: "MARTA buses",
        detail: "Route 51 runs along Joseph E. Boone Blvd, Route 3 along Martin Luther King Jr. Dr, and Route 853 serves the neighborhood.",
      },
      {
        kind: "trail",
        title: "Atlanta Beltline",
        detail: "The Westside Trail runs along the neighborhood's eastern edge at Washington Park.",
      },
      {
        kind: "park",
        title: "Parks and trails",
        detail: "The Lionel Hampton Trail runs through Hunter Hills, linking Washington Park and Mozley Park.",
      },
    ],
  },
];

export function getProperty(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export function displayAddress(p: Property) {
  return SHOW_HOUSE_NUMBERS ? p.address : p.streetName;
}

// Choices for the "preferred property" field: each home, plus its private room.
const PRIVATE_SUFFIX = ":private";

export function placementOptions(withAvailability = false) {
  return properties.flatMap((p) => {
    const beds = p.availableBeds === 0 ? "full, waitlist" : `${p.availableBeds} open`;
    const options = [{ value: p.slug, label: withAvailability ? `${p.name}, shared room (${beds})` : `${p.name}, shared room` }];
    if (p.privateRoom) {
      options.push({
        value: p.slug + PRIVATE_SUFFIX,
        label: `${p.name}, private room (${privateRoomPrice(p) ?? "ask for pricing"})`,
      });
    }
    return options;
  });
}

export function privateRoomPrice(p: Property) {
  return p.privateRoom?.price ? `$${p.privateRoom.price.toLocaleString("en-US")}/mo` : null;
}

export function placementName(value: string) {
  return placementOptions().find((o) => o.value === value)?.label ?? "No preference";
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

// Neighborhood-wide highlights for the home page.
export const areaHighlights: { kind: GetAroundKind; title: string; detail: string }[] = [
  {
    kind: "rail",
    title: "MARTA rail",
    detail: "Ashby, West Lake, and Bankhead stations connect the neighborhood to Downtown and Midtown, with transfers to the rest of the MARTA system.",
  },
  {
    kind: "bus",
    title: "MARTA buses",
    detail: "Routes 3, 51, and 853 run along Martin Luther King Jr. Dr, Joseph E. Boone Blvd, and through Hunter Hills.",
  },
  {
    kind: "trail",
    title: "Atlanta Beltline",
    detail: "The 2.7-mile Westside Trail runs from Ashby station to West Lake station, right past our homes.",
  },
  {
    kind: "park",
    title: "Parks",
    detail: "Mozley Park and Washington Park, linked by the Lionel Hampton Trail. Downtown is about three miles east.",
  },
];
