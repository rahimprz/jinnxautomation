/**
 * Confirms a payment the browser has just completed, so the payer sees a result
 * immediately instead of waiting on Stripe's webhook.
 *
 * Callers: app/pay/[token]/PayForm.tsx, same origin.
 *
 * The browser hands over a PaymentIntent id and nothing else of consequence. The
 * id is a claim, not proof: the intent is re-fetched from Stripe here, its status
 * must be succeeded, and the invoice token it carries in its own metadata must be
 * the token being paid. A caller who invents an id, or replays someone else's,
 * gets nowhere.
 *
 * The webhook (app/api/pay/webhook) does the same work independently, so a payer
 * who closes the tab mid-confirm still ends up with a settled invoice.
 */
import { NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { looksLikeToken, markInvoicePaid } from '@/lib/invoice';

export const dynamic = 'force-dynamic';

type Body = { token?: string; payment_intent_id?: string };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const token = (body.token ?? '').trim();
  const intentId = (body.payment_intent_id ?? '').trim();
  if (!looksLikeToken(token) || !intentId) {
    return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
  }

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    console.error('[pay/confirm]', err);
    return NextResponse.json({ error: 'Payments are not set up.' }, { status: 503 });
  }

  let intent;
  try {
    intent = await stripe.paymentIntents.retrieve(intentId);
  } catch (err) {
    console.error('[pay/confirm] could not retrieve the intent', err);
    return NextResponse.json(
      { error: 'We could not verify this payment. Please contact us before paying again.' },
      { status: 502 },
    );
  }

  // The intent must belong to this invoice, or one payment could settle another.
  if ((intent.metadata?.invoice_token ?? '') !== token) {
    console.warn('[pay/confirm] intent/token mismatch', intent.id);
    return NextResponse.json({ error: 'This payment does not match this invoice.' }, { status: 409 });
  }

  if (intent.status === 'processing') {
    // Some methods settle minutes later. The webhook will mark it paid; saying so
    // beats telling the payer it failed and inviting a second payment.
    return NextResponse.json({
      processing: true,
      message:
        'Your payment is being processed. You will get a confirmation by email once it clears.',
    });
  }

  if (intent.status !== 'succeeded') {
    return NextResponse.json(
      { error: `This payment did not go through (${intent.status}). Please try again.` },
      { status: 402 },
    );
  }

  const recorded = await markInvoicePaid(token, intent.id);
  if (!recorded) {
    // The money is taken. Never report that as a failure - the webhook will retry
    // the bookkeeping, and telling the payer it failed invites a second payment.
    console.error('[pay/confirm] paid but not recorded', intent.id);
  }

  return NextResponse.json({
    success: true,
    message: 'Thank you. Your payment has been received.',
  });
}
