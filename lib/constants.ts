// ─── Store Info ───────────────────────────────────────────────────────────────
// TODO: Replace all placeholder values with real store information before launch

export const STORE = {
  name: "Produce World",
  tagline: "Fresh. Family. Thirty Years Strong.",
  established: "1994",
  address: {
    street: "8325 W Lawrence Ave",
    neighborhood: "Norridge",
    city: "Norridge",
    state: "IL",
    zip: "60706",
    googleMapsUrl: "https://maps.google.com/?q=Produce+World+8325+W+Lawrence+Ave+Norridge+IL+60706",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.5!2d-87.8195!3d41.9634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e4f8b2b2b2b2b%3A0x0!2sProduce+World!5e0!3m2!1sen!2sus!4v1234567890",
  },
  phone: "(708) 452-7400",
  email: "[YOUR EMAIL ADDRESS]",
  instagram: "@produce_world_market",
  hours: [
    { day: "Monday – Sunday", open: "7:30 AM", close: "9:00 PM" },
  ],
  googleRating: 4.1,
  googleReviewCount: 900,
  googlePlaceId: "[YOUR_GOOGLE_PLACE_ID]", // TODO: Replace with real Place ID for Google Places API
};

// ─── Specialty Cards ──────────────────────────────────────────────────────────
export const SPECIALTIES = [
  {
    id: 1,
    title: "Mediterranean Imports",
    description:
      "Olives, figs, pomegranates, preserved lemons, Kalamata olive oils, and regional cheeses sourced from across the Mediterranean.",
    imageId: "1464965911861-746a04b4bca6",
    tag: "IMPORTED · SEASONAL",
  },
  {
    id: 2,
    title: "Balkan & Serbian Favorites",
    description:
      "Ajvar, specialty peppers, dried herbs, and seasonal picks beloved by Chicago's Balkan community.",
    imageId: "1556909114-f6e7ad7d3136",
    tag: "SPECIALTY · REGIONAL",
  },
  {
    id: 3,
    title: "Italian & Greek Produce",
    description:
      "Heirloom tomatoes, artichokes, fresh fennel, brined grape leaves, and authentic pantry staples.",
    imageId: "1540420773420-3366772f4999",
    tag: "AUTHENTIC · FRESH",
  },
  {
    id: 4,
    title: "Locally Sourced & Seasonal",
    description:
      "Working directly with Midwest farms to bring you the freshest seasonal produce, available as soon as it's harvested.",
    imageId: "1592924357228-91a4daadcfea",
    tag: "LOCAL · SEASONAL",
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────
// TODO: Replace with Google Places API data using STORE.googlePlaceId
export const REVIEWS = [
  {
    id: 1,
    stars: 5,
    quote:
      "This place is a gem. I've been coming here for 20 years and they always have exactly what I need for my Serbian recipes. The family knows every customer by name.",
    reviewer: "Milena K.",
    location: "Chicago",
  },
  {
    id: 2,
    stars: 5,
    quote:
      "Best Mediterranean produce in the city. The figs and pomegranates are always fresh and the prices are fair. Feels like shopping in Greece.",
    reviewer: "Dimitri P.",
    location: "Albany Park",
  },
  {
    id: 3,
    stars: 5,
    quote:
      "I asked for a specific type of pepper my grandmother used in her cooking back in Bosnia. They had it stocked the next week. That's real community.",
    reviewer: "Amira T.",
    location: "Ravenswood",
  },
  {
    id: 4,
    stars: 5,
    quote:
      "Thirty years strong and still the best in Chicago. The produce quality here is unmatched. I drive 45 minutes every weekend and it's worth every mile.",
    reviewer: "Joseph M.",
    location: "Oak Park",
  },
];

// ─── Gallery Images ───────────────────────────────────────────────────────────
export const GALLERY_IMAGES = [
  { id: "1488459716781-6eddbe0f8e41", alt: "Fresh colorful peppers and vegetables" },
  { id: "1506617564039-2f3b650b7010", alt: "Vibrant market produce overhead" },
  { id: "1471193945891-364f17a6e64e", alt: "Colorful fresh fruit market" },
  { id: "1518843875459-f738682238a6", alt: "Family market fresh produce" },
  { id: "1574226516831-e1dff420e562", alt: "Colorful vegetables and herbs" },
  { id: "1563746924-9e3a2e8f3ca2", alt: "Mediterranean olives and specialties" },
  { id: "1598170845058-32b9d6a5da37", alt: "Heirloom tomatoes warm light" },
  { id: "1518977822534-7049a61ee0c2", alt: "Fresh greens and herbs" },
];
