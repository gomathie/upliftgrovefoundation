const MNOTIFY_BASE = 'https://api.mnotify.com/api';
const API_KEY = process.env.MNOTIFY_API_KEY;
const SENDER_ID = process.env.MNOTIFY_SENDER_ID || 'UpliftGrv';

export interface SmsResponse {
  status: string;
  code: string;
  message: string;
  summary?: {
    _id: string;
    recipients: number;
    total_sent: number;
    credit_used: number;
    credit_left: number;
  };
}

/**
 * Normalizes phone numbers to standard formats if necessary.
 * mNotify accepts local Ghana format (e.g. 0241234567) or E.164 (+233241234567).
 */
export function normalizePhoneNumber(phone: string): string {
  const clean = phone.replace(/[^\d+]/g, '');
  // If local format starting with 0, keep it or normalize as desired.
  // This function ensures the phone string is clean of spaces, dashes, etc.
  return clean;
}

/**
 * Sends an SMS campaign via mNotify API v2.0.
 * Runs server-side only.
 * 
 * @param recipients Single phone number string or array of phone number strings
 * @param message Message content (concise)
 * @returns Response data from mNotify containing campaign ID
 */
export async function sendSms(
  recipients: string | string[],
  message: string
): Promise<SmsResponse> {
  if (!API_KEY) {
    throw new Error('MNOTIFY_API_KEY is not configured in environment variables.');
  }

  const recipientList = Array.isArray(recipients) 
    ? recipients.map(normalizePhoneNumber)
    : [normalizePhoneNumber(recipients)];

  const body = {
    recipient: recipientList,
    sender: SENDER_ID,
    message: message,
    is_schedule: false,
    schedule_date: '',
  };

  const url = `${MNOTIFY_BASE}/sms/quick?key=${encodeURIComponent(API_KEY)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.status !== 'success') {
    console.error('mNotify send failed:', res.status, data);
    throw new Error(`SMS send failed: ${data.message || data.code || res.status}`);
  }

  return data as SmsResponse;
}
