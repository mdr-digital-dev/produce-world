import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Produce World | Fresh Market in Norridge, IL",
  description:
    "Norridge's premier international produce market. Thirty years of fresh Mediterranean, Greek, Italian, Serbian, and Balkan specialty produce at 8325 W Lawrence Ave.",
  keywords: [
    "produce market Norridge IL",
    "grocery store Norridge",
    "Mediterranean produce Chicago",
    "Greek market Chicago suburbs",
    "international grocery Norridge",
    "fresh produce 8325 W Lawrence Ave",
    "Balkan food Chicago",
    "European grocery near me",
  ],
  openGraph: {
    title: "Produce World | Fresh Market in Norridge, IL",
    description:
      "Fresh. Family. Thirty Years Strong. Norridge's premier international produce market at 8325 W Lawrence Ave.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
