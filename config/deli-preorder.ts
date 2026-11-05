export const DELI_PREORDER = {
  active: true,
  products: [
    {
      id: "pastitsio",
      name: "Pastitsio",
      description:
        "Classic Greek baked pasta with seasoned ground beef and béchamel, layered and baked in a 6 lb aluminum tray — perfect for the holiday table.",
      size: "6 lb aluminum tray",
      price: null as number | null,
    },
    {
      id: "moussaka",
      name: "Moussaka",
      description:
        "Layers of roasted eggplant, spiced ground meat, and golden béchamel in a 6 lb aluminum tray — a Mediterranean holiday tradition.",
      size: "6 lb aluminum tray",
      price: null as number | null,
    },
  ],
  pickupDates: [] as string[],
  orderCutoff: null as string | null,
  maxQtyPerItem: 10,
};

export type DeliProduct = (typeof DELI_PREORDER.products)[number];
