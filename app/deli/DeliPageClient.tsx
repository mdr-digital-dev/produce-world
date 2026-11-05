"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DELI_PREORDER } from "@/config/deli-preorder";
import { STORE } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  phone: string;
  email: string;
  pastitsioQty: number;
  moussakaQty: number;
  pickupDate: string;
  notes: string;
  website: string; // honeypot
};

type OrderResult = {
  orderNumber: string;
  pickupDate: string;
  items: { name: string; qty: number }[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isOrdersClosed(): boolean {
  if (!DELI_PREORDER.active) return true;
  if (DELI_PREORDER.orderCutoff) {
    return new Date() > new Date(DELI_PREORDER.orderCutoff);
  }
  return false;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Qty Selector ─────────────────────────────────────────────────────────────

function QtySelector({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        className="w-10 h-10 font-dm-sans text-lg flex items-center justify-center transition-colors duration-200"
        style={{
          border: `1px solid ${value === 0 ? "#E8E2D9" : "#2C3B2D"}`,
          color: value === 0 ? "#E8E2D9" : "#2C3B2D",
        }}
      >
        −
      </button>
      <span
        className="font-cormorant font-semibold text-2xl w-8 text-center"
        style={{ color: "#1A1A1A" }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 font-dm-sans text-lg flex items-center justify-center transition-colors duration-200"
        style={{
          border: `1px solid ${value >= max ? "#E8E2D9" : "#2C3B2D"}`,
          color: value >= max ? "#E8E2D9" : "#2C3B2D",
        }}
      >
        +
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DeliPageClient() {
  const closed = isOrdersClosed();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    pastitsioQty: 0,
    moussakaQty: 0,
    pickupDate: "",
    notes: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const formTopRef = useRef<HTMLDivElement>(null);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Please enter your full name.";
    const phone = form.phone.replace(/\D/g, "");
    if (phone.length < 10) e.phone = "Please enter a valid phone number.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Please enter a valid email address.";
    if (form.pastitsioQty === 0 && form.moussakaQty === 0)
      e.qty = "Please select at least one item.";
    if (!form.pickupDate) e.pickupDate = "Please select a pickup date.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.website) return; // honeypot
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/deli-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setOrderResult(data);
      setStatus("success");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setStatus("error");
    }
  }

  function resetForm() {
    setForm({
      name: "",
      phone: "",
      email: "",
      pastitsioQty: 0,
      moussakaQty: 0,
      pickupDate: "",
      notes: "",
      website: "",
    });
    setErrors({});
    setStatus("idle");
    setOrderResult(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#2C3B2D" }}
        className="pt-32 pb-20 px-6 text-center"
      >
        <Image
          src="/logo.png"
          alt="Produce World"
          width={72}
          height={72}
          className="mx-auto object-contain mb-6 opacity-90"
        />
        <p
          className="font-dm-sans text-xs tracking-widest uppercase mb-4"
          style={{ color: "#C9A84C", letterSpacing: "0.22em" }}
        >
          Holiday Deli · Limited Availability
        </p>
        <h1
          className="font-cormorant font-semibold mb-6"
          style={{ fontSize: "clamp(42px, 6vw, 72px)", color: "#F5F0E8" }}
        >
          Holiday Pre-Orders
        </h1>
        <p
          className="font-dm-sans font-light max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(245,240,232,0.75)", fontSize: "17px" }}
        >
          Reserve your Pastitsio or Moussaka trays made fresh in our deli.
          Available for pickup at the store — perfect for the holiday table.
        </p>
      </section>

      {/* Gold divider */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: "#C9A84C", opacity: 0.3 }}
      />

      {/* ── Closed ────────────────────────────────────────────────────────── */}
      {closed ? (
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <p
              className="font-dm-sans text-xs tracking-widest uppercase mb-6"
              style={{ color: "#B85C38", letterSpacing: "0.22em" }}
            >
              Pre-orders closed
            </p>
            <h2
              className="font-cormorant font-semibold mb-6"
              style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#1A1A1A" }}
            >
              Orders Are Now Closed
            </h2>
            <p
              className="font-dm-sans font-light leading-relaxed mb-10"
              style={{ color: "rgba(26,26,26,0.65)", fontSize: "16px" }}
            >
              Pre-orders for this season have closed. Thank you for your
              interest — check back next season or call us for availability.
            </p>
            <a
              href={`tel:${STORE.phone}`}
              className="btn-fill inline-flex items-center gap-3 font-dm-sans text-xs tracking-widest uppercase px-8 py-4 border text-charcoal transition-colors duration-300 hover:text-ivory"
              style={{ borderColor: "#2C3B2D", letterSpacing: "0.2em" }}
            >
              {STORE.phone}
            </a>
          </div>
        </section>

      /* ── Success ──────────────────────────────────────────────────────── */
      ) : status === "success" && orderResult ? (
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <p
              className="font-dm-sans text-xs tracking-widest uppercase mb-4"
              style={{ color: "#C9A84C", letterSpacing: "0.22em" }}
            >
              Order Confirmed
            </p>
            <h2
              className="font-cormorant font-semibold mb-4"
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                color: "#1A1A1A",
              }}
            >
              Thank You, {form.name.split(" ")[0]}!
            </h2>
            <p
              className="font-dm-sans font-light mb-10"
              style={{ color: "rgba(26,26,26,0.65)", fontSize: "16px" }}
            >
              A confirmation has been sent to {form.email}.
            </p>

            <div
              className="p-8 mb-10 text-left"
              style={{
                backgroundColor: "#FDFAF4",
                border: "1px solid #E8E2D9",
              }}
            >
              <p
                className="font-dm-sans text-xs tracking-widest uppercase mb-6"
                style={{ color: "#B85C38", letterSpacing: "0.18em" }}
              >
                Order #{orderResult.orderNumber}
              </p>
              {orderResult.items.map((item) => (
                <p
                  key={item.name}
                  className="font-cormorant font-semibold text-2xl mb-2"
                  style={{ color: "#1A1A1A" }}
                >
                  {item.qty} × {item.name}
                </p>
              ))}
              <div
                className="mt-6 pt-6"
                style={{ borderTop: "1px solid #E8E2D9" }}
              >
                <p
                  className="font-dm-sans font-light text-sm"
                  style={{ color: "rgba(26,26,26,0.65)" }}
                >
                  Pickup: {formatDate(orderResult.pickupDate)}
                </p>
                <p
                  className="font-dm-sans font-light text-sm mt-1"
                  style={{ color: "rgba(26,26,26,0.65)" }}
                >
                  {STORE.address.street}, {STORE.address.city},{" "}
                  {STORE.address.state}
                </p>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="font-dm-sans text-xs tracking-widest uppercase animated-link"
              style={{ color: "#B85C38", letterSpacing: "0.22em" }}
            >
              Place another order
            </button>
          </div>
        </section>

      ) : (
        /* ── Products + Form ────────────────────────────────────────────── */
        <main ref={formTopRef}>
          {/* Products */}
          <section className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p
                  className="font-dm-sans text-xs tracking-widest uppercase mb-3"
                  style={{ color: "#B85C38", letterSpacing: "0.22em" }}
                >
                  Available Items
                </p>
                <h2
                  className="font-cormorant font-semibold"
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    color: "#1A1A1A",
                  }}
                >
                  Deli Specialties
                </h2>
              </div>

              <div
                className="flex flex-col md:flex-row gap-px"
                style={{ backgroundColor: "#E8E2D9" }}
              >
                {DELI_PREORDER.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex-1 p-8 lg:p-10"
                    style={{ backgroundColor: "#FDFAF4" }}
                  >
                    <p
                      className="font-dm-sans text-xs tracking-widest uppercase mb-4"
                      style={{ color: "#C9A84C", letterSpacing: "0.22em" }}
                    >
                      {product.size}
                    </p>
                    <h3
                      className="font-cormorant font-semibold mb-4"
                      style={{
                        fontSize: "clamp(26px, 3.5vw, 38px)",
                        color: "#1A1A1A",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="font-dm-sans font-light leading-relaxed"
                      style={{
                        color: "rgba(26,26,26,0.65)",
                        fontSize: "15px",
                      }}
                    >
                      {product.description}
                    </p>
                    {product.price !== null && (
                      <p
                        className="font-cormorant font-semibold text-2xl mt-6"
                        style={{ color: "#2C3B2D" }}
                      >
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="max-w-5xl mx-auto px-6">
            <div
              className="w-full h-px"
              style={{ backgroundColor: "#C9A84C", opacity: 0.2 }}
            />
          </div>

          {/* Form */}
          <section className="py-16 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <p
                  className="font-dm-sans text-xs tracking-widest uppercase mb-3"
                  style={{ color: "#B85C38", letterSpacing: "0.22em" }}
                >
                  Reserve Your Order
                </p>
                <h2
                  className="font-cormorant font-semibold"
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    color: "#1A1A1A",
                  }}
                >
                  Place Your Pre-Order
                </h2>
                {DELI_PREORDER.orderCutoff && (
                  <p
                    className="font-dm-sans font-light text-sm mt-4"
                    style={{ color: "rgba(26,26,26,0.5)" }}
                  >
                    Orders close{" "}
                    {formatDate(DELI_PREORDER.orderCutoff.split("T")[0])}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "auto",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                  />
                </div>

                {/* Name */}
                <div className="mb-6">
                  <label
                    className="block font-dm-sans text-xs tracking-widest uppercase mb-2"
                    style={{ color: "#1A1A1A", letterSpacing: "0.18em" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-4 py-3 font-dm-sans font-light text-sm"
                    style={{
                      backgroundColor: "#FDFAF4",
                      border: `1px solid ${errors.name ? "#B85C38" : "#E8E2D9"}`,
                      color: "#1A1A1A",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#C9A84C")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = errors.name
                        ? "#B85C38"
                        : "#E8E2D9")
                    }
                    placeholder="Maria Papadopoulos"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p
                      className="font-dm-sans text-xs mt-1"
                      style={{ color: "#B85C38" }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <label
                    className="block font-dm-sans text-xs tracking-widest uppercase mb-2"
                    style={{ color: "#1A1A1A", letterSpacing: "0.18em" }}
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 font-dm-sans font-light text-sm"
                    style={{
                      backgroundColor: "#FDFAF4",
                      border: `1px solid ${errors.phone ? "#B85C38" : "#E8E2D9"}`,
                      color: "#1A1A1A",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#C9A84C")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = errors.phone
                        ? "#B85C38"
                        : "#E8E2D9")
                    }
                    placeholder="(708) 555-0100"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p
                      className="font-dm-sans text-xs mt-1"
                      style={{ color: "#B85C38" }}
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label
                    className="block font-dm-sans text-xs tracking-widest uppercase mb-2"
                    style={{ color: "#1A1A1A", letterSpacing: "0.18em" }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 font-dm-sans font-light text-sm"
                    style={{
                      backgroundColor: "#FDFAF4",
                      border: `1px solid ${errors.email ? "#B85C38" : "#E8E2D9"}`,
                      color: "#1A1A1A",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#C9A84C")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = errors.email
                        ? "#B85C38"
                        : "#E8E2D9")
                    }
                    placeholder="maria@example.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p
                      className="font-dm-sans text-xs mt-1"
                      style={{ color: "#B85C38" }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Quantities */}
                <div
                  className="mb-6 p-6"
                  style={{
                    backgroundColor: "#FDFAF4",
                    border: "1px solid #E8E2D9",
                  }}
                >
                  <p
                    className="font-dm-sans text-xs tracking-widest uppercase mb-6"
                    style={{ color: "#1A1A1A", letterSpacing: "0.18em" }}
                  >
                    Quantities *
                  </p>
                  {errors.qty && (
                    <p
                      className="font-dm-sans text-xs mb-4"
                      style={{ color: "#B85C38" }}
                    >
                      {errors.qty}
                    </p>
                  )}
                  <div className="flex flex-col gap-6">
                    {DELI_PREORDER.products.map((product) => {
                      const key =
                        `${product.id}Qty` as "pastitsioQty" | "moussakaQty";
                      return (
                        <div
                          key={product.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p
                              className="font-cormorant font-semibold text-xl"
                              style={{ color: "#1A1A1A" }}
                            >
                              {product.name}
                            </p>
                            <p
                              className="font-dm-sans font-light text-xs"
                              style={{ color: "rgba(26,26,26,0.5)" }}
                            >
                              {product.size}
                            </p>
                          </div>
                          <QtySelector
                            value={form[key]}
                            max={DELI_PREORDER.maxQtyPerItem}
                            onChange={(v) =>
                              setForm({ ...form, [key]: v })
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pickup Date */}
                <div className="mb-6">
                  <label
                    className="block font-dm-sans text-xs tracking-widest uppercase mb-2"
                    style={{ color: "#1A1A1A", letterSpacing: "0.18em" }}
                  >
                    Pickup Date *
                  </label>
                  {DELI_PREORDER.pickupDates.length > 0 ? (
                    <select
                      value={form.pickupDate}
                      onChange={(e) =>
                        setForm({ ...form, pickupDate: e.target.value })
                      }
                      className="w-full px-4 py-3 font-dm-sans font-light text-sm"
                      style={{
                        backgroundColor: "#FDFAF4",
                        border: `1px solid ${errors.pickupDate ? "#B85C38" : "#E8E2D9"}`,
                        color: form.pickupDate
                          ? "#1A1A1A"
                          : "rgba(26,26,26,0.4)",
                        outline: "none",
                        appearance: "none",
                      }}
                    >
                      <option value="" disabled>
                        Select a pickup date
                      </option>
                      {DELI_PREORDER.pickupDates.map((d) => (
                        <option key={d} value={d}>
                          {formatDate(d)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="date"
                      value={form.pickupDate}
                      min={todayISO()}
                      onChange={(e) =>
                        setForm({ ...form, pickupDate: e.target.value })
                      }
                      className="w-full px-4 py-3 font-dm-sans font-light text-sm"
                      style={{
                        backgroundColor: "#FDFAF4",
                        border: `1px solid ${errors.pickupDate ? "#B85C38" : "#E8E2D9"}`,
                        color: "#1A1A1A",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "#C9A84C")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = errors.pickupDate
                          ? "#B85C38"
                          : "#E8E2D9")
                      }
                    />
                  )}
                  {errors.pickupDate && (
                    <p
                      className="font-dm-sans text-xs mt-1"
                      style={{ color: "#B85C38" }}
                    >
                      {errors.pickupDate}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="mb-8">
                  <label
                    className="block font-dm-sans text-xs tracking-widest uppercase mb-2"
                    style={{ color: "#1A1A1A", letterSpacing: "0.18em" }}
                  >
                    Special Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 font-dm-sans font-light text-sm resize-none"
                    style={{
                      backgroundColor: "#FDFAF4",
                      border: "1px solid #E8E2D9",
                      color: "#1A1A1A",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#C9A84C")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "#E8E2D9")
                    }
                    placeholder="Any special requests or notes for your order…"
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <div
                    className="mb-6 p-4"
                    style={{
                      backgroundColor: "rgba(184,92,56,0.08)",
                      border: "1px solid #B85C38",
                    }}
                  >
                    <p
                      className="font-dm-sans text-sm"
                      style={{ color: "#B85C38" }}
                    >
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-fill w-full font-dm-sans text-xs tracking-widest uppercase px-8 py-5 border text-charcoal transition-colors duration-300 hover:text-ivory"
                  style={{
                    borderColor: "#2C3B2D",
                    letterSpacing: "0.2em",
                    opacity: status === "submitting" ? 0.6 : 1,
                  }}
                >
                  {status === "submitting"
                    ? "Placing Order…"
                    : "Place Pre-Order"}
                </button>

                <p
                  className="font-dm-sans font-light text-xs text-center mt-4"
                  style={{ color: "rgba(26,26,26,0.45)" }}
                >
                  A confirmation will be sent to your email.
                  {STORE.phone && (
                    <>
                      {" "}
                      Questions?{" "}
                      <a
                        href={`tel:${STORE.phone}`}
                        className="animated-link"
                        style={{ color: "#B85C38" }}
                      >
                        {STORE.phone}
                      </a>
                    </>
                  )}
                </p>
              </form>
            </div>
          </section>
        </main>
      )}

      <Footer />
    </div>
  );
}
