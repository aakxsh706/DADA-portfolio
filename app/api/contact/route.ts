import { NextResponse } from 'next/server';
import { hasErrors, normalizeContact, validateContact, type ContactInput } from '@/lib/contact';
import { siteConfig } from '@/data/site-config';

/**
 * Contact form endpoint.
 *
 * Delivery providers (first configured one wins — both have free tiers):
 *  - Resend:     RESEND_API_KEY + CONTACT_TO_EMAIL (+ optional CONTACT_FROM_EMAIL)
 *  - Web3Forms:  WEB3FORMS_ACCESS_KEY
 *
 * With neither configured the route answers 503 `not_configured` so the UI can be
 * honest and offer a prefilled email instead.
 */

const MIN_FILL_TIME_MS = 3000;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map<string, number[]>();

const json = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

const rateLimited = (key: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // best-effort memory cap on long-lived instances
  return recent.length > RATE_LIMIT.max;
};

const clientKey = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'anonymous').trim();
};

const composeText = (input: ContactInput) =>
  [
    `New project inquiry via ${siteConfig.name}`,
    '',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Project type: ${input.projectType}`,
    `Budget: ${input.budget || '—'}`,
    '',
    'Message:',
    input.message,
  ].join('\n');

async function deliverWithResend(input: ContactInput, apiKey: string, to: string) {
  const from = process.env.CONTACT_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Inquiry: ${input.projectType} — ${input.name}`,
      text: composeText(input),
    }),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}`);
}

async function deliverWithWeb3Forms(input: ContactInput, accessKey: string) {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Inquiry: ${input.projectType} — ${input.name}`,
      from_name: siteConfig.name,
      name: input.name,
      email: input.email,
      project_type: input.projectType,
      budget: input.budget || '—',
      message: input.message,
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as { success?: boolean };
  if (!response.ok || !payload.success) throw new Error(`Web3Forms responded ${response.status}`);
}

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 20_000) return json(413, { ok: false, code: 'too_large', message: 'Message too large.' });
    raw = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, code: 'bad_request', message: 'Invalid request body.' });
  }

  const input = normalizeContact(raw);

  // Honeypot: bots fill the hidden field. Discard quietly.
  if (input.company && input.company.length > 0) return json(200, { ok: true });

  // Time trap: humans need more than a few seconds to fill the form.
  if (input.startedAt && Date.now() - input.startedAt < MIN_FILL_TIME_MS)
    return json(429, { ok: false, code: 'too_fast', message: 'That was quick — please take a moment and try again.' });

  if (rateLimited(clientKey(request)))
    return json(429, { ok: false, code: 'rate_limited', message: 'Too many messages in a short time. Please try again later.' });

  const errors = validateContact(input);
  if (hasErrors(errors)) return json(400, { ok: false, code: 'validation', errors, message: 'Please check the highlighted fields.' });

  const resendKey = process.env.RESEND_API_KEY;
  const resendTo = process.env.CONTACT_TO_EMAIL;
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;

  if (!(resendKey && resendTo) && !web3Key) {
    return json(503, {
      ok: false,
      code: 'not_configured',
      message: 'Message delivery is not configured on this deployment yet.',
    });
  }

  try {
    if (resendKey && resendTo) await deliverWithResend(input, resendKey, resendTo);
    else if (web3Key) await deliverWithWeb3Forms(input, web3Key);
    return json(200, { ok: true });
  } catch (error) {
    console.error('[contact] delivery failed', error);
    return json(502, {
      ok: false,
      code: 'delivery_failed',
      message: 'Your message could not be delivered right now. Please try again or email us directly.',
    });
  }
}
