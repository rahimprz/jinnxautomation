/**
 * Stripe's callback, and the only thing allowed to mark an invoice paid.
 *
 * Callers: Stripe. Never the browser.
 *
 * Two rules, both taken from the Book Press implementation:
 *  - the signature is verified against the raw body, so a forged POST cannot
 *    settle an invoice nobody paid;
 *  - the PaymentIntent is re-fetched from Stripe rather than read out of the
 *    event, because the event is a snapshot and the authoritative status lives
 *    at Stripe.
 *
 * Anything that fails transiently returns 5xx so Stripe retries. Anything that
 * can never succeed returns 2xx, because a webhook Stripe retries forever is its
 * own kind of outage.
 */
import { NextResponse } from 'next/server';
import { getStripeClient, getStripeWebhookSecret } from '@/lib/stripe';
import { markInvoicePaid } from '@/lib/invoice';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const secret = getStripeWebhookSecret();
  if (!secret) {
    console.error('[pay/webhook] no webhook secret configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  // The raw body, byte for byte - parsing it first would break the signature.
  const raw = await request.text();

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    console.error('[pay/webhook]', err);
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error('[pay/webhook] bad signature', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const idFromEvent = (event.data.object as { id?: string })?.id;
  if (!idFromEvent) {
    return NextResponse.json({ received: true, ignored: 'no payment intent id' });
  }

  let intent;
  try {
    intent = await stripe.paymentIntents.retrieve(idFromEvent);
  } catch (err) {
    console.error('[pay/webhook] could not re-fetch the payment intent', err);
    // Transient: let Stripe try again rather than losing the payment record.
    return NextResponse.json({ error: 'Could not verify, will retry' }, { status: 500 });
  }

  if (intent.status !== 'succeeded') {
    return NextResponse.json({ received: true, ignored: intent.status });
  }

  const token = (intent.metadata?.invoice_token ?? '').trim();
  if (!token) {
    // Nothing to reconcile against, and retrying will not conjure one.
    console.warn('[pay/webhook] succeeded intent with no invoice_token', intent.id);
    return NextResponse.json({ received: true, ignored: 'no invoice token' });
  }

  const marked = await markInvoicePaid(token, intent.id);
  if (!marked) {
    // The money is taken but the CRM does not know; Stripe must retry.
    return NextResponse.json({ error: 'Could not record payment, will retry' }, { status: 500 });
  }

  return NextResponse.json({ received: true, recorded: intent.id });
}
