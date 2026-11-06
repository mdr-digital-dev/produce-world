import { NextRequest, NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { DELI_PREORDER } from "@/config/deli-preorder";
import { STORE } from "@/lib/constants";

// Layers of bot protection on this route (in order):
// 1. Vercel Firewall rate-limit rule on /api/deli-order (set in the Vercel dashboard)
// 2. Vercel BotID — invisible challenge, blocks headless browsers/scripts
// 3. Origin check — only accepts posts from our own site
// 4. Body size cap + strict JSON validation
// 5. Honeypot field, minimum fill time, and "real person interacted" signal
// 6. Per-IP rate limit and duplicate-order guard (per server instance)
// 7. Spam-content checks (links in name/notes)
// Bots caught by 5 get a fake "success" so they don't learn what tripped them.

const MAX_BODY_BYTES = 4_000;
const MIN_FILL_MS = 4_000; // a human can't fill this form in under 4 seconds
const RATE_LIMIT = { max: 3, windowMs: 10 * 60_000 }; // 3 orders / 10 min / IP
const DUPLICATE_WINDOW_MS = 15 * 60_000;

const ALLOWED_HOSTS = [
  "produceworldil.com",
  "www.produceworldil.com",
  "produce-world.vercel.app",
];
const ALLOWED_HOST_SUFFIX = "-rodjarv13-7510s-projects.vercel.app"; // previews

// ─── In-memory guards (best effort; the Vercel Firewall rule is the hard limit)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const recentOrders = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }
  if (entry.count >= RATE_LIMIT.max) return false;
  entry.count++;
  return true;
}

function isDuplicate(key: string): boolean {
  const now = Date.now();
  recentOrders.forEach((t, k) => {
    if (now - t > DUPLICATE_WINDOW_MS) recentOrders.delete(k);
  });
  if (recentOrders.has(key)) return true;
  recentOrders.set(key, now);
  return false;
}

function hostAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin") ?? req.headers.get("referer");
  if (!origin) return false;
  try {
    const host = new URL(origin).host;
    if (!process.env.VERCEL && /^localhost(:\d+)?$/.test(host)) return true; // local dev
    return ALLOWED_HOSTS.includes(host) || host.endsWith(ALLOWED_HOST_SUFFIX);
  } catch {
    return false;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

const URL_PATTERN = /(https?:\/\/|www\.|\.(com|net|ru|xyz|top|io)\b)/i;

function formatPhone(digits: string): string {
  const d = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : digits;
}

function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function chicagoToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
}

function makeOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return "PW-" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

// A believable success for bots, with nothing sent.
const fakeSuccess = () =>
  NextResponse.json({ orderNumber: makeOrderNumber(), items: [], pickupDate: "" });

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 2. BotID
  // (Only runs on Vercel. If BotID itself errors, log it and fall through to the
  // other layers rather than blocking real customers.)
  if (process.env.VERCEL) {
    try {
      const verification = await checkBotId();
      if (verification.isBot) return fail("Access denied.", 403);
    } catch (e) {
      console.error("[deli-order] BotID check errored", e);
    }
  }

  // 3. Origin
  if (!hostAllowed(req)) return fail("Access denied.", 403);

  // 6a. Rate limit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip))
    return fail(`Too many orders from this device. Please call us at ${STORE.phone}.`, 429);

  // 4. Size + JSON
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail("Invalid request.", 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (typeof body !== "object" || body === null || Array.isArray(body)) throw 0;
  } catch {
    return fail("Invalid request.");
  }

  // 5. Honeypot, fill time, interaction
  if (body.website) return fakeSuccess();
  const elapsedMs = Number(body.elapsedMs);
  if (!Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS) return fakeSuccess();
  if (body.interacted !== true) return fakeSuccess();

  // Store open?
  if (!DELI_PREORDER.active) return fail("Pre-orders are closed.", 403);
  if (DELI_PREORDER.orderCutoff && new Date() > new Date(DELI_PREORDER.orderCutoff))
    return fail("Pre-orders are closed.", 403);

  // Validate fields
  const name = String(body.name ?? "").trim().replace(/\s+/g, " ");
  const phoneDigits = String(body.phone ?? "").replace(/\D/g, "");
  const email = String(body.email ?? "").trim().toLowerCase();
  const pickupDate = String(body.pickupDate ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (name.length < 2 || name.length > 80 || URL_PATTERN.test(name) || /[<>]/.test(name))
    return fail("Please enter your full name.");
  if (!(phoneDigits.length === 10 || (phoneDigits.length === 11 && phoneDigits.startsWith("1"))))
    return fail("Please enter a valid phone number.");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email))
    return fail("Please enter a valid email address.");
  if (notes.length > 500) return fail("Notes are too long (500 characters max).");
  if (URL_PATTERN.test(notes)) return fail("Please don't include links in the notes.");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) || isNaN(Date.parse(pickupDate)))
    return fail("Please select a pickup date.");
  if (DELI_PREORDER.pickupDates.length > 0) {
    if (!DELI_PREORDER.pickupDates.includes(pickupDate))
      return fail("Please pick one of the listed pickup dates.");
  } else if (pickupDate < chicagoToday()) {
    return fail("Pickup date can't be in the past.");
  }

  // Quantities: only known products, whole numbers, 0..max each
  const q = body.quantities;
  if (typeof q !== "object" || q === null || Array.isArray(q)) return fail("Invalid request.");
  const quantities = q as Record<string, unknown>;
  const max = DELI_PREORDER.maxQtyPerItem;
  for (const key of Object.keys(quantities)) {
    if (!DELI_PREORDER.products.some((p) => p.id === key)) return fail("Invalid item.");
  }
  const items: { name: string; qty: number; size: string }[] = [];
  for (const p of DELI_PREORDER.products) {
    const v = quantities[p.id] ?? 0;
    if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v > max)
      return fail(`You can order up to ${max} of each item.`);
    if (v > 0) items.push({ name: p.name, qty: v, size: p.size });
  }
  if (items.length === 0) return fail("Please select at least one item.");

  // 6b. Same person, same order, twice in a row = double tap or a bot
  const dupKey = `${email}|${phoneDigits}|${pickupDate}|${items.map((i) => i.name + i.qty).join(",")}`;
  if (isDuplicate(dupKey))
    return fail(`Looks like we already have this order. Call ${STORE.phone} if you need to change it.`, 409);

  // ─── Build the emails ───────────────────────────────────────────────────────
  const orderNumber = makeOrderNumber();
  const phone = formatPhone(phoneDigits);
  const pickupPretty = formatDate(pickupDate);
  const totalTrays = items.reduce((n, i) => n + i.qty, 0);
  const submitted = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const itemsShort = items.map((i) => `${i.qty} ${i.name}`).join(", ");
  const storeAddress = `${STORE.address.street}, ${STORE.address.city}, ${STORE.address.state} ${STORE.address.zip}`;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${label}</td><td style="padding:6px 0;font-weight:600">${value}</td></tr>`;

  const itemsTable = `
    <table style="border-collapse:collapse;width:100%;max-width:480px;margin:12px 0;font-size:16px">
      <thead><tr style="background:#2C3B2D;color:#fff">
        <th style="text-align:left;padding:8px 12px">Item</th>
        <th style="text-align:center;padding:8px 12px">Qty</th>
      </tr></thead>
      <tbody>
        ${items
          .map(
            (i) => `<tr style="border-bottom:1px solid #e5e5e5">
          <td style="padding:10px 12px">${esc(i.name)}<br><span style="color:#888;font-size:13px">${esc(i.size)}</span></td>
          <td style="padding:10px 12px;text-align:center;font-size:20px;font-weight:700">${i.qty}</td></tr>`
          )
          .join("")}
        <tr><td style="padding:10px 12px;font-weight:700">Total trays</td>
          <td style="padding:10px 12px;text-align:center;font-weight:700">${totalTrays}</td></tr>
      </tbody>
    </table>`;

  const deliHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:560px">
      <h2 style="margin:0 0 4px;color:#2C3B2D">New Holiday Pre-Order</h2>
      <p style="margin:0 0 16px;font-size:18px"><strong>${orderNumber}</strong> &middot; Pickup <strong>${esc(pickupPretty)}</strong></p>
      ${itemsTable}
      <table style="border-collapse:collapse;font-size:15px;margin-top:8px">
        ${row("Customer", esc(name))}
        ${row("Phone", `<a href="tel:${phoneDigits}">${esc(phone)}</a>`)}
        ${row("Email", `<a href="mailto:${esc(email)}">${esc(email)}</a>`)}
        ${row("Pickup", esc(pickupPretty))}
        ${row("Notes", notes ? esc(notes).replace(/\n/g, "<br>") : "<span style='color:#999'>None</span>")}
        ${row("Submitted", esc(submitted))}
      </table>
      <p style="color:#888;font-size:12px;margin-top:20px">Reply to this email to reach the customer directly. Payment at pickup.</p>
    </div>`;

  const deliText = [
    `NEW HOLIDAY PRE-ORDER ${orderNumber}`,
    `Pickup: ${pickupPretty}`,
    ``,
    ...items.map((i) => `  ${i.qty} x ${i.name} (${i.size})`),
    `  Total trays: ${totalTrays}`,
    ``,
    `Customer: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Notes: ${notes || "None"}`,
    `Submitted: ${submitted}`,
  ].join("\n");

  const customerHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:560px">
      <h2 style="color:#2C3B2D">Thank you, ${esc(name.split(" ")[0])}! We got your order.</h2>
      <p>Order <strong>${orderNumber}</strong></p>
      ${itemsTable}
      <p><strong>Pickup:</strong> ${esc(pickupPretty)} at the Produce World deli<br>${esc(storeAddress)}</p>
      <p>Payment is made at pickup.</p>
      <p style="color:#666">Need to change something? Call us at ${esc(STORE.phone)} or reply to this email.</p>
    </div>`;

  // ─── Send ───────────────────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const orderInbox = process.env.ORDER_INBOX ?? "deli@produceworldil.com";
  const orderFrom = process.env.ORDER_FROM ?? "Produce World Deli <orders@produceworldil.com>";

  if (!resendKey) {
    if (process.env.VERCEL_ENV === "production") {
      // Never tell a customer their order went through when it didn't.
      console.error(`[deli-order] RESEND_API_KEY missing — order ${orderNumber} NOT delivered`, deliText);
      return fail(`Online ordering is temporarily unavailable. Please call the deli at ${STORE.phone}.`, 503);
    }
    console.log(`[deli-order] (dev, no RESEND_API_KEY)\n${deliText}`);
  } else {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    // The deli email MUST go out, so wait for it and fail loudly if it doesn't.
    const deli = await resend.emails.send({
      from: orderFrom,
      to: [orderInbox],
      replyTo: email,
      subject: `Pre-Order ${orderNumber}: ${itemsShort} — ${name} — Pickup ${pickupPretty}`,
      html: deliHtml,
      text: deliText,
    });
    if (deli.error) {
      console.error(`[deli-order] deli email failed for ${orderNumber}`, deli.error, deliText);
      return fail(`We couldn't place your order right now. Please call the deli at ${STORE.phone}.`, 502);
    }

    const cust = await resend.emails.send({
      from: orderFrom,
      to: [email],
      replyTo: orderInbox,
      subject: `We got your order! ${orderNumber} — Pickup ${pickupPretty}`,
      html: customerHtml,
    });
    if (cust.error) console.error(`[deli-order] confirmation failed for ${orderNumber}`, cust.error);
  }

  // Optional Google Sheet log
  const webhookUrl = process.env.ORDER_SHEET_WEBHOOK;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        submittedAt: new Date().toISOString(),
        name,
        phone,
        email,
        ...Object.fromEntries(DELI_PREORDER.products.map((p) => [p.id, quantities[p.id] ?? 0])),
        pickupDate,
        notes,
      }),
    }).catch((e) => console.error("[deli-order] sheet webhook failed", e));
  }

  return NextResponse.json({ orderNumber, pickupDate, items });
}
