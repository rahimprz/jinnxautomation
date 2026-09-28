/**
 * Stripe client for the payment-link flow (app/pay/[token], app/api/pay/intent,
 * app/api/pay/webhook).
 *
 * Ported from the Jinnx Book Press site so both brands behave identically and the
 * same environment variable names work in either Vercel project. Mode is decided
 * server-side from STRIPE_MODE and is never read from the browser or the URL: a
 * page that could ask to be charged in test mode is a page that can be paid with
 * a test card.
 */
import Stripe from 'stripe';

export type StripeMode = 'test' | 'live';

export function getStripeMode(): StripeMode {
  return process.env.STRIPE_MODE === 'live' ? 'live' : 'test';
}

// Spelled out rather than templated, so one place has to agree with .env instead
// of two files independently getting a naming convention right.
const ENV_NAMES = {
  SECRET: { test: 'STRIPE_SECRET_KEY_TEST', live: 'STRIPE_SECRET_KEY_LIVE' },
  PUBLISHABLE: {
    test: 'STRIPE_PUBLISHABLE_KEY_TEST',
    live: 'STRIPE_PUBLISHABLE_KEY_LIVE',
  },
  WEBHOOK_SECRET: {
    test: 'STRIPE_WEBHOOK_SECRET_TEST',
    live: 'STRIPE_WEBHOOK_SECRET_LIVE',
  },
} as const;

function keyFor(mode: StripeMode, kind: keyof typeof ENV_NAMES): string {
  return process.env[ENV_NAMES[kind][mode]] || '';
}

export function getStripePublishableKey(mode: StripeMode = getStripeMode()): string {
  return keyFor(mode, 'PUBLISHABLE');
}

export function getStripeWebhookSecret(mode: StripeMode = getStripeMode()): string {
  return keyFor(mode, 'WEBHOOK_SECRET');
}

let cached: { mode: StripeMode; client: Stripe } | null = null;

/**
 * Throws when the secret key for the current mode is missing. Every caller is
 * inside a request handler that turns this into a clean message rather than a
 * stack trace in front of a paying customer.
 */
export function getStripeClient(mode: StripeMode = getStripeMode()): Stripe {
  if (cached && cached.mode === mode) return cached.client;
  const secretKey = keyFor(mode, 'SECRET');
  if (!secretKey) {
    throw new Error(
      `Stripe secret key is not configured for ${mode} mode (${ENV_NAMES.SECRET[mode]}).`,
    );
  }
  const client = new Stripe(secretKey);
  cached = { mode, client };
  return client;
}
