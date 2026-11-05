import type { Metadata } from "next";
import DeliPageClient from "./DeliPageClient";

export const metadata: Metadata = {
  title: "Holiday Deli Pre-Orders | Produce World",
  description:
    "Pre-order your holiday Pastitsio and Moussaka trays from Produce World's deli in Norridge, IL. Fresh, made in-house, available for pickup.",
};

export default function DeliPage() {
  return <DeliPageClient />;
}
