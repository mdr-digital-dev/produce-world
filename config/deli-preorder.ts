// All business details for the holiday deli pre-order page live here.
// Edit this file to change products, limits, prices, pickup dates or the cutoff.

export type DeliProduct = {
  id: string; // lowercase letters/dashes only — used as the form field key
  name: string;
  description: string;
  size: string;
  price: number | null; // null = don't show a price
};

export const DELI_PREORDER = {
  active: true, // false = show "Pre-orders are closed"
  products: [
    {
      id: "pastitsio",
      name: "Pastitsio",
      description:
        "Classic Greek baked pasta with seasoned ground beef and béchamel, layered and baked in a 6 lb aluminum tray — perfect for the holiday table.",
      size: "6 lb aluminum tray",
      price: null,
    },
    {
      id: "moussaka",
      name: "Moussaka",
      description:
        "Layers of roasted eggplant, spiced ground meat, and golden béchamel in a 6 lb aluminum tray — a Mediterranean holiday tradition.",
      size: "6 lb aluminum tray",
      price: null,
    },
    {
      id: "spinach-pie",
      name: "Spinach Pie",
      description:
        "Spanakopita — spinach, feta and herbs baked between golden layers of flaky phyllo. A holiday favorite, with or without the main course.",
      size: "Aluminum tray", // TODO: confirm size with the deli
      price: null,
    },
  ] as DeliProduct[],
  pickupDates: [] as string[], // e.g. ["2026-12-22", "2026-12-23", "2026-12-24"]
  orderCutoff: null as string | null, // ISO date/time; after it, the form closes
  maxQtyPerItem: 7, // max of EACH item per order
};

export function productById(id: string): DeliProduct | undefined {
  return DELI_PREORDER.products.find((p) => p.id === id);
}
