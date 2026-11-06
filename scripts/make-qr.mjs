// Generates the flyer QR code for the deli pre-order page and scan-tests it.
// Run: node scripts/make-qr.mjs
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import { readFileSync } from "node:fs";

const URL =
  "https://produceworldil.com/deli?utm_source=flyer&utm_medium=qr&utm_campaign=holiday_deli";
const opts = { errorCorrectionLevel: "H", margin: 4, color: { dark: "#000000", light: "#FFFFFF" } };

await QRCode.toFile("public/qr/deli-preorder.png", URL, { ...opts, width: 2000 });
await QRCode.toFile("public/qr/deli-preorder.svg", URL, { ...opts, type: "svg" });

const png = PNG.sync.read(readFileSync("public/qr/deli-preorder.png"));
const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
if (decoded?.data !== URL) throw new Error(`QR scan test FAILED: got ${decoded?.data}`);
console.log(`QR OK (${png.width}x${png.height}) -> ${decoded.data}`);
