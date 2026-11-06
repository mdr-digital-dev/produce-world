# Deli pre-order: email + bot protection setup

Until steps 1–3 are done, the live form will show customers **"Online ordering is temporarily
unavailable, please call the deli"** instead of pretending the order went through.

DNS for produceworldil.com is at **GoDaddy** (nameservers ns33/ns34.domaincontrol.com).
The site's A record points to Vercel (76.76.21.21) — don't touch it.

## 1. Make deli@produceworldil.com a real inbox (receives the orders)

**Free option: ImprovMX forwarding** (deli@ → an existing Gmail)
1. Sign up at improvmx.com, add `produceworldil.com`, create alias `deli` → the Gmail that should get orders.
2. In GoDaddy → My Products → produceworldil.com → DNS, add:

| Type | Name | Value | Priority |
|------|------|-------|----------|
| MX | @ | mx1.improvmx.com | 10 |
| MX | @ | mx2.improvmx.com | 20 |
| TXT | @ | `v=spf1 include:spf.improvmx.com ~all` | — |

   First delete any existing GoDaddy MX records (if GoDaddy shows "Workspace Email" / secureserver.net
   MX records and nobody uses that email). If there's already an SPF TXT (`v=spf1 ...`) on `@`,
   merge into it rather than adding a second one.
3. Send a test email to deli@produceworldil.com.

Upgrade later: Google Workspace (~$7/user/mo) if Zach wants to *reply as* deli@.

## 2. Let the website send the order emails (Resend)

1. Sign up at resend.com → Domains → Add `produceworldil.com`.
2. Resend shows ~3 records (a DKIM TXT `resend._domainkey`, plus an MX and SPF TXT on the `send`
   subdomain). Add them in GoDaddy DNS exactly as shown. They live on `send.` / `resend._domainkey`,
   so they don't clash with the ImprovMX records on `@`.
3. Wait for Resend to say **Verified**, then API Keys → create a key with "Sending access".

## 3. Add the settings in Vercel

Vercel → produce-world → Settings → Environment Variables (Production + Preview):

```
RESEND_API_KEY = re_...                         (from step 2)
ORDER_INBOX    = deli@produceworldil.com
ORDER_FROM     = Produce World Deli <orders@produceworldil.com>
ORDER_SHEET_WEBHOOK =                           (optional Google Sheet log)
```

Then Deployments → latest production → **Redeploy** so the settings take effect.
Place one test order and check that deli@ gets it and the customer confirmation arrives.

## 4. Bot protection — the dashboard parts

The code already includes: Vercel BotID (invisible challenge), origin check, honeypot,
minimum fill time, real-interaction check, per-IP limit, duplicate-order guard, link-spam filter,
strict validation, and HTML escaping in the emails.

Add the hard edge rate limit (Vercel → produce-world → Firewall → Configure → New Rule):
- **Name:** Rate limit deli order form
- **If:** Request Path *equals* `/api/deli-order` **and** Method *equals* `POST`
- **Then:** Rate Limit — Fixed window, 600 seconds, 5 requests, key: IP → **Deny**, for 1 hour
- Save → **Publish**

Also in Firewall → Bot Management: turn **Bot Protection** on (challenge mode) if your plan shows it.
OIDC must be on for BotID (Settings → Security → "Secure backend access with OIDC federation");
new projects have it on by default.

## Changing the menu or limits

Everything is in `config/deli-preorder.ts`: products, prices, `maxQtyPerItem` (now 7),
pickup dates, order cutoff, and `active` (set to `false` to close orders).

## QR code

`public/qr/deli-preorder.svg` (print) and `.png` (2000px), regenerate with `node scripts/make-qr.mjs`.
Links to `https://produceworldil.com/deli?utm_source=flyer&utm_medium=qr&utm_campaign=holiday_deli`.
