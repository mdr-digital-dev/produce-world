import { NextRequest, NextResponse } from "next/server";

// ─── In-memory rate limiting ───────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silent accept
  if (body.website) {
    return NextResponse.json({
      orderNumber: `PW-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [],
      pickupDate: "",
    });
  }

  // ─── Sanitise & validate ────────────────────────────────────────────────────
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  const email = String(body.email ?? "").trim();
  const pastitsioQty = Math.max(
    0,
    Math.min(10, parseInt(String(body.pastitsioQty ?? "0"), 10) || 0)
  );
  const moussakaQty = Math.max(
    0,
    Math.min(10, parseInt(String(body.moussakaQty ?? "0"), 10) || 0)
  );
  const pickupDate = String(body.pickupDate ?? "").trim();
  const notes = String(body.notes ?? "").trim().slice(0, 500);

  if (!name || name.length < 2)
    return NextResponse.json({ error: "Invalid name." }, { status: 400 });
  if (phone.length < 10)
    return NextResponse.json(
      { error: "Invalid phone number." },
      { status: 400 }
    );
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  if (pastitsioQty === 0 && moussakaQty === 0)
    return NextResponse.json(
      { error: "Please select at least one item." },
      { status: 400 }
    );
  if (!pickupDate)
    return NextResponse.json(
      { error: "Please select a pickup date." },
      { status: 400 }
    );

  const orderNumber = `PW-${Math.floor(1000 + Math.random() * 9000)}`;
  const items = [
    ...(pastitsioQty > 0 ? [{ name: "Pastitsio", qty: pastitsioQty }] : []),
    ...(moussakaQty > 0 ? [{ name: "Moussaka", qty: moussakaQty }] : []),
  ];
  const itemsText = items.map((i) => `${i.qty} × ${i.name}`).join(", ");

  // ─── Emails via Resend ──────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const orderInbox =
    process.env.ORDER_INBOX ?? "deli@produceworldil.com";
  const orderFrom =
    process.env.ORDER_FROM ??
    "Produce World Deli <orders@produceworldil.com>";

  if (resendKey) {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    // Notify deli inbox
    resend.emails
      .send({
        from: orderFrom,
        to: [orderInbox],
        subject: `New Pre-Order #${orderNumber} — ${name}`,
        html: `
          <h2 style="font-family:Georgia,serif;color:#2C3B2D">New Deli Pre-Order</h2>
          <p><strong>Order #:</strong> ${orderNumber}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Items:</strong> ${itemsText}</p>
          <p><strong>Pickup Date:</strong> ${pickupDate}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        `,
      })
      .catch(console.error);

    // Confirm to customer
    resend.emails
      .send({
        from: orderFrom,
        to: [email],
        subject: `Your Pre-Order is Confirmed — #${orderNumber}`,
        html: `
          <h2 style="font-family:Georgia,serif;color:#2C3B2D">Thank you, ${name}!</h2>
          <p>Your pre-order has been confirmed.</p>
          <p><strong>Order #:</strong> ${orderNumber}</p>
          <p><strong>Items:</strong> ${itemsText}</p>
          <p><strong>Pickup Date:</strong> ${pickupDate}</p>
          <p><strong>Pickup Location:</strong> 8325 W Lawrence Ave, Norridge, IL 60706</p>
          <p style="margin-top:16px;color:#666">Questions? Call us at (708) 452-7400.</p>
        `,
      })
      .catch(console.error);
  } else {
    console.log(
      `[deli-order] No RESEND_API_KEY — order ${orderNumber} logged:`,
      { name, phone, email, pastitsioQty, moussakaQty, pickupDate, notes }
    );
  }

  // ─── Optional Google Sheet webhook ─────────────────────────────────────────
  const webhookUrl = process.env.ORDER_SHEET_WEBHOOK;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        submittedAt: new Date().toISOString(),
        name,
        phone,
        email,
        pastitsioQty,
        moussakaQty,
        pickupDate,
        notes,
      }),
    }).catch(console.error);
  }

  return NextResponse.json({ orderNumber, pickupDate, items });
}
