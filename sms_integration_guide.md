# UpliftGrove Foundation — mNotify SMS Integration Guide

**Audience:** Developer / build agent integrating SMS into the UpliftGrove Foundation website.
**Provider:** mNotify (BMS — Bulk Messaging Solution) · API v2.0
**Source:** https://readthedocs.mnotify.com
**Version:** 1.0 · July 2026

> **Verify-before-ship note:** The base URL, authentication method, and the endpoint shapes below were taken from mNotify's published documentation. A few items — the exact numeric **status/error codes**, and the precise **delivery-status** and **balance** endpoint paths — can vary by account/version. These are marked **⚠ VERIFY** in the doc. Confirm each against a live test response from your own account before relying on it in production.

---

## 1. What this integration does

For UpliftGrove, SMS is used to:

1. **Send a confirmation** to a young person after they submit the confidential intake form ("We received your message. A counselor will reach out soon.").
2. **Alert a counselor/staff number** that a new intake request has arrived, so they can respond quickly.
3. _(Optional)_ Send **OTP** codes if you add phone verification anywhere on the site.

Because these are transactional, time-sensitive messages tied to youth support, delivery reliability and privacy matter — see Section 9.

---

## 2. Prerequisites

Before writing code, the account owner must have:

| Item                     | How to get it                                                  | Notes                                                                                                   |
| ------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| mNotify/BMS account      | https://apps.mnotify.net                                       | The Foundation should own this account, not the developer.                                              |
| **API key**              | Dashboard → API menu (`https://apps.mnotify.net/api/api`)      | Treat like a password. Never commit to source control or expose in client-side JS.                      |
| **Registered Sender ID** | Register via dashboard or the sender-ID endpoint (Section 5.4) | Max **11 characters**, alphanumeric. Must be approved before use. Suggested: `UpliftGrv` or `UpliftGr`. |
| **Wallet balance**       | Top up in dashboard                                            | SMS is pay-as-you-go; OTP sends cost extra (see Section 5.1).                                           |

---

## 3. Base URL & conventions

- **Base URL:** `https://api.mnotify.com/api`
- **Protocol:** REST over HTTPS. Uses standard verbs: `GET`, `POST`, `PUT`, `DELETE`.
- **Payload/response format:** JSON. Always send `Content-Type: application/json` on POST/PUT.
- **Phone number format:** local Ghana format works (e.g. `0241234567`). For robustness, also accept and normalize E.164 (`+233241234567`). Confirm your account's accepted format in testing.
- **Message/campaign ID:** successful sends return an `_id` (also called the **campaign id**). Store it — it's how you later check delivery status.

---

## 4. Authentication

mNotify authenticates with an **API key passed as a query-string parameter** named `key` on **every** request:

```
https://api.mnotify.com/api/sms/quick?key=YOUR_API_KEY
```

**Important security consequence:** because the key travels in the URL, all calls **must** be made **server-side**. Never place the key or these calls in browser/React code — doing so exposes the Foundation's key to anyone who views source or network traffic, letting them drain the SMS wallet. The website's backend (or a serverless function) calls mNotify; the frontend only calls your own backend.

---

## 5. Endpoints

### 5.1 Quick SMS — `POST /sms/quick`

Send to one or more numbers without pre-storing them in a group. This is the main endpoint for UpliftGrove's confirmation + alert messages.

**Request**

```
POST https://api.mnotify.com/api/sms/quick?key=YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "recipient": ["0241234567", "0201234567"],
  "sender": "UpliftGrv",
  "message": "Thank you for reaching out to UpliftGrove. A counselor will contact you soon. You are safe with us.",
  "is_schedule": false,
  "schedule_date": ""
}
```

**Fields**

| Field           | Type     | Required        | Notes                                                                                                                                                |
| --------------- | -------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipient`     | string[] | yes             | One or more phone numbers.                                                                                                                           |
| `sender`        | string   | yes             | Your **approved** Sender ID (≤ 11 chars).                                                                                                            |
| `message`       | string   | yes             | Body text. Keep concise (see cost note).                                                                                                             |
| `is_schedule`   | boolean  | yes             | `true` to schedule for later, else `false`.                                                                                                          |
| `schedule_date` | string   | when scheduling | Format `YYYY-MM-DD hh:mm`. Empty string when not scheduling.                                                                                         |
| `sms_type`      | string   | no              | Set to `"otp"` **only** for OTP messages. **Adds a charge of 0.035 per campaign.** Do **not** include it otherwise — it can cause validation errors. |

**Response (shape)**

```json
{
  "status": "success",
  "code": "2000",
  "message": "Messages sent successfully",
  "summary": {
    "_id": "abc123campaignid",
    "recipients": 2,
    "total_sent": 2,
    "credit_used": 2,
    "credit_left": 148
  }
}
```

Store `summary._id` (the **campaign id**) to check delivery later. _(Exact response keys can differ slightly by account — log the full first response and adjust your parser. ⚠ VERIFY)_

### 5.2 Group SMS — `POST /sms/group`

Send to a saved contact group (useful if UpliftGrove later sends newsletters/updates to volunteers or donors — **not** for confidential intake replies).

```json
{
  "group_id": ["1", "2"],
  "sender": "UpliftGrv",
  "message_id": "17481",
  "is_schedule": false,
  "schedule_date": ""
}
```

`message_id` refers to a stored template (Section 5.5).

### 5.3 Scheduled messages — `POST /scheduled`, `POST /scheduled/{id}`

List scheduled messages: `POST /scheduled?key=YOUR_API_KEY`.
Update a scheduled message:

```
POST https://api.mnotify.com/api/scheduled/{id}?key=YOUR_API_KEY
```

```json
{
  "sender": "UpliftGrv",
  "message": "Updated reminder",
  "schedule_date": "2026-08-01 17:56:00"
}
```

### 5.4 Register Sender ID — `POST /senderid/register`

```
POST https://api.mnotify.com/api/senderid/register?key=YOUR_API_KEY
```

```json
{
  "sender_name": "UpliftGrv",
  "purpose": "Sending intake confirmations and counselor alerts"
}
```

Registration is reviewed/approved by mNotify before the sender ID can be used. Do this early — approval isn't instant.

### 5.5 Message templates — `/template`

- List all: `GET /template?key=YOUR_API_KEY`
- Get one: `GET /template/{id}?key=YOUR_API_KEY`
- Create: `POST /template?key=YOUR_API_KEY` — `{ "title": "...", "body": "..." }`
- Update: `PUT /template/{id}?key=YOUR_API_KEY`

Templates support placeholders: `[fname]`, `[lname]`, `[fullname]`, `[title]`. The create response returns the new template `_id`.

### 5.6 Delivery status ⚠ VERIFY

After sending, use the returned campaign `_id` to query delivery status. mNotify exposes a delivery-status/campaign lookup for this; confirm the exact path in your dashboard's API reference (commonly a `GET` call keyed by the campaign id, e.g. `GET /status/{campaign_id}?key=...` or `GET /campaign/{id}?key=...`). Build your status-check helper against whatever your live account returns, and treat statuses as: delivered / pending / failed.

### 5.7 Balance check ⚠ VERIFY

There is a balance endpoint (commonly `GET /balance/sms?key=YOUR_API_KEY`). Use it to alert staff when the SMS wallet runs low, so intake confirmations never silently fail. Confirm the exact path against your account.

---

## 6. Code samples

All examples assume the key is loaded from an environment variable (`MNOTIFY_API_KEY`) and the calls run **server-side**.

### 6.1 cURL

```bash
curl -X POST "https://api.mnotify.com/api/sms/quick?key=$MNOTIFY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": ["0241234567"],
    "sender": "UpliftGrv",
    "message": "Thank you for reaching out to UpliftGrove. A counselor will contact you soon.",
    "is_schedule": false,
    "schedule_date": ""
  }'
```

### 6.2 Node.js (native fetch, Node 18+)

```js
// sms.js — server-side only. Never import into client bundles.
const MNOTIFY_BASE = "https://api.mnotify.com/api";
const API_KEY = process.env.MNOTIFY_API_KEY;
const SENDER_ID = process.env.MNOTIFY_SENDER_ID || "UpliftGrv";

export async function sendSms(recipients, message, { sms_type } = {}) {
  if (!API_KEY) throw new Error("MNOTIFY_API_KEY is not set");

  const body = {
    recipient: Array.isArray(recipients) ? recipients : [recipients],
    sender: SENDER_ID,
    message,
    is_schedule: false,
    schedule_date: "",
  };
  if (sms_type === "otp") body.sms_type = "otp"; // only when truly an OTP

  const res = await fetch(
    `${MNOTIFY_BASE}/sms/quick?key=${encodeURIComponent(API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status !== "success") {
    // Log full response server-side for debugging; never expose the key.
    console.error("mNotify send failed:", res.status, data);
    throw new Error(`SMS send failed (code ${data.code ?? res.status})`);
  }
  return data; // contains campaign _id for delivery-status checks
}
```

### 6.3 Python (requests)

```python
import os, requests

MNOTIFY_BASE = "https://api.mnotify.com/api"
API_KEY = os.environ["MNOTIFY_API_KEY"]
SENDER_ID = os.environ.get("MNOTIFY_SENDER_ID", "UpliftGrv")

def send_sms(recipients, message, sms_type=None):
    if isinstance(recipients, str):
        recipients = [recipients]
    payload = {
        "recipient": recipients,
        "sender": SENDER_ID,
        "message": message,
        "is_schedule": False,
        "schedule_date": "",
    }
    if sms_type == "otp":
        payload["sms_type"] = "otp"

    r = requests.post(
        f"{MNOTIFY_BASE}/sms/quick",
        params={"key": API_KEY},
        json=payload,
        timeout=15,
    )
    data = r.json()
    if not r.ok or data.get("status") != "success":
        raise RuntimeError(f"SMS failed: {data}")
    return data
```

### 6.4 PHP (cURL)

```php
<?php
$apiKey = getenv('MNOTIFY_API_KEY');
$url = "https://api.mnotify.com/api/sms/quick?key=" . urlencode($apiKey);

$payload = json_encode([
    "recipient" => ["0241234567"],
    "sender" => "UpliftGrv",
    "message" => "Thank you for reaching out to UpliftGrove. A counselor will contact you soon.",
    "is_schedule" => false,
    "schedule_date" => "",
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

---

## 7. Status / error codes ⚠ VERIFY

mNotify returns a `status` string and a numeric `code`. The values below reflect mNotify's commonly documented codes — **confirm each against a live response from your account**, as exact codes and messages can differ by version.

| Code   | Meaning                                    | Agent action                                       |
| ------ | ------------------------------------------ | -------------------------------------------------- |
| `2000` | Success — message(s) accepted              | Store campaign `_id`; proceed.                     |
| `1002` | Send failed                                | Retry with backoff; log.                           |
| `1003` | Insufficient balance                       | Alert staff to top up; queue message.              |
| `1004` | Invalid API key                            | Stop; check env var / key validity. Do not retry.  |
| `1005` | Invalid phone number                       | Validate/normalize number; surface friendly error. |
| `1006` | Invalid / unapproved Sender ID             | Confirm sender ID is registered & approved.        |
| `1007` | Numeric sender not allowed / message issue | Fix payload.                                       |
| `1008` | Empty / no message                         | Ensure `message` is non-empty.                     |

**HTTP layer:** also handle standard HTTP codes — `401/403` (auth), `429` (rate limited → exponential backoff), `5xx` (provider issue → retry with backoff). Always branch on **both** the HTTP status and the JSON `code`.

---

## 8. Wiring it into the intake form

Recommended flow (all server-side after the form POSTs to your backend):

```
User submits intake form
        │
        ▼
Backend validates + stores submission (encrypted)      ← see main site doc §5.4
        │
        ├──►  sendSms(userPhone, confirmationMessage)   // reassure the young person
        │
        └──►  sendSms(counselorPhone, alertMessage)     // notify staff of new intake
        │
        ▼
Store returned campaign _id(s) alongside the submission for delivery auditing
```

**Message copy suggestions (keep warm, simple, low-literacy-friendly):**

- To the youth: _"Thank you for reaching out to UpliftGrove. We received your message and a counselor will contact you soon. You are safe with us."_
- To the counselor: _"New UpliftGrove intake received. Please check the dashboard and respond."_ — **do not** put the young person's message content or identifying details in the alert SMS; keep sensitive content in the secure dashboard only.

**Failure handling:** if the confirmation SMS fails, still save the submission and still alert the counselor (don't let one failed SMS drop the whole request). Log failures and retry transient ones.

---

## 9. Security & privacy requirements (non-negotiable for this project)

Because this touches messages to young people, potentially minors:

1. **Server-side only.** The API key travels in the URL — never call mNotify from the browser. Frontend → your backend → mNotify.
2. **Secrets in environment variables**, never in code or git. Rotate the key if it's ever exposed.
3. **Minimize content in SMS.** Confirmation and alert texts should not contain the young person's message, alias, or location. Sensitive detail stays in the encrypted intake store, not in SMS.
4. **Consent to be texted.** Only SMS the number the person themselves provided, for the purpose they provided it (responding to their request). No marketing SMS to intake numbers.
5. **Log responsibly.** Log campaign IDs and status codes for debugging, but avoid logging full phone numbers or message bodies in plaintext application logs.
6. **Low-balance alerting.** Monitor wallet balance so a depleted account never silently swallows an at-risk young person's confirmation.

---

## 10. Testing checklist

- [ ] Send a real test SMS to a staff phone via `/sms/quick`; confirm receipt and correct Sender ID display.
- [ ] Log and inspect the **full** JSON response; map its real keys (`_id`, `code`, `status`) into your parser.
- [ ] Confirm the exact **status/error codes** your account returns (Section 7) and adjust the handler.
- [ ] Confirm the exact **delivery-status** and **balance** endpoint paths (Sections 5.6–5.7).
- [ ] Verify accepted **phone-number format** (local `0XXXXXXXXX` vs E.164) and normalize inputs accordingly.
- [ ] Test failure paths: invalid key, unapproved sender ID, empty message, insufficient balance.
- [ ] Confirm the key is **not** present in any client bundle or network call from the browser.
- [ ] Verify OTP path separately **only if** OTP is used (remember the 0.035/campaign charge).

---

## 11. Items to confirm with the account owner / mNotify

1. Final approved **Sender ID** string (≤ 11 chars).
2. Exact **status/error code** table for your account version.
3. Exact **delivery-status** and **balance** endpoint paths.
4. Accepted **phone-number format** and any DND/network restrictions.
5. Whether **delivery webhooks/callbacks** are available (vs. polling by campaign id) — mNotify also offers inbound message webhooks; confirm outbound delivery-callback support if you want push status updates.
6. Rate limits on your plan.

---

_Prepared as an integration reference for the UpliftGrove Foundation website build. Confirm all ⚠ VERIFY items against a live response from the Foundation's own mNotify account before production use._
