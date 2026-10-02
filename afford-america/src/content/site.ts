// Central place for business details. Anything marked TODO is a placeholder
// that must be replaced before the site goes live.

export const site = {
  brand: "Afford America Community Living",
  shortBrand: "Afford America",
  legalName: "Afford America LLC",
  tagline: "All-inclusive supportive independent living in West Atlanta.",
  description:
    "Fully furnished, non-clinical supportive independent living in West Atlanta (30314) for adults 55+, veterans, and adults who thrive in a structured home. One flat monthly package. Referrals welcome from case managers, social workers, and discharge planners.",
  // TODO: replace with real contact details.
  phone: "(404) 555-0100",
  phoneHref: "tel:+14045550100",
  email: "placements@affordamerica.example",
  serviceArea: "West Atlanta, GA 30314",
  hours: "Monday to Friday, 9am to 6pm. Same-week tours available.",
};

export const monthlyPackage = {
  price: 1650,
  label: "All-inclusive monthly package",
  occupancy: "Shared furnished bedroom, two residents per room",
  includes: [
    {
      title: "Furnished room and board",
      detail: "A shared bedroom in a renovated home with bed, linens, and dresser ready on day one. Residents bring personal clothing.",
    },
    { title: "All utilities and Wi-Fi", detail: "Power, water, gas, trash, and high-speed internet. No separate bills." },
    {
      title: "TV access and personal headphones",
      detail: "Every resident gets TV access and their own Bluetooth headphones, so shows and music never disturb a roommate.",
    },
    { title: "Weekly grocery coordination", detail: "Grocery procurement logistics each week. EBT/SNAP compatible." },
    {
      title: "Daily sanitizing and professional cleaning",
      detail: "The house host sanitizes kitchens, bathrooms, and shared spaces every day. A professional cleaning crew cleans them every two weeks.",
    },
    { title: "Smart medication dispenser rental", detail: "Automated reminder and dispensing hardware residents use on their own schedule." },
  ],
};

export const fundingSources = [
  "HUD-VASH vouchers",
  "Georgia Housing Voucher Program (GHVP)",
  "SSDI",
  "SSI",
  "VA pensions and benefits",
  "Private pensions",
  "Direct pay",
];

export const audiences = [
  {
    id: "veterans",
    title: "Veterans",
    who: "HUD-VASH housing specialists, VA social workers, and homeless veteran program coordinators.",
    detail:
      "Move-in ready furnished rooms with every utility included, accepting HUD-VASH vouchers, VA pensions, and SSDI.",
  },
  {
    id: "older-adults",
    title: "Adults 55+",
    who: "Empowerline options counselors, referral coordinators, and aging services housing specialists.",
    detail:
      "Independent living with daily sanitizing, professional cleaning, grocery logistics, and medication reminder hardware, without the cost of institutional care.",
  },
  {
    id: "behavioral-health",
    title: "Supportive housing",
    who: "DBHDD Region 3 housing coordinators, GHVP field specialists, and community mental health providers.",
    detail:
      "A stable, structured home for independent adults connected to outpatient or community-based services.",
  },
  {
    id: "discharge",
    title: "Hospital discharge",
    who: "Inpatient case managers, ED social workers, and discharge planners at Grady, Emory Midtown, and area hospitals.",
    detail:
      "Immediate placement for ambulatory patients who do not need skilled nursing but need somewhere stable to go.",
  },
];

export const residentCriteria = {
  goodFit: [
    "Adult who is independent and ambulatory",
    "Manages their own daily living activities (bathing, dressing, eating) without staff assistance",
    "Self-administers their own medications",
    "Has a stable monthly income source or voucher to cover the package",
    "Comfortable sharing a bedroom with one roommate and common spaces",
  ],
  notAFit: [
    "Needs skilled nursing or hands-on personal care from staff",
    "Needs staff to administer medications",
    "Requires a secured or memory care setting",
  ],
};

export const notProvided =
  "Afford America is a non-clinical housing provider. We do not provide medical care, nursing, personal care, or medication administration. Residents are welcome to use visiting home health aides, mobile care teams, and outpatient providers of their choosing.";
