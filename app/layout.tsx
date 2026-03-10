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
  title: "Produce World | Albany Park, Chicago",
  description:
    "Chicago's premier international produce market. Thirty years of fresh Mediterranean, Greek, Italian, Serbian, and Balkan imports in the heart of Albany Park.",
  keywords: [
    "produce market Chicago",
    "Mediterranean produce",
    "Greek market Chicago",
    "Albany Park grocery",
    "Balkan food Chicago",
    "international market",
  ],
  openGraph: {
    title: "Produce World | Albany Park, Chicago",
    description:
      "Fresh. Family. Thirty Years Strong. Chicago's premier international produce market.",
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
