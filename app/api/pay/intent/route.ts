/**
 * Creates the Stripe PaymentIntent for one invoice.
 *
 * Callers: app/pay/[token]/PayForm.tsx only, same origin.
 *
 * The request carries the token and the billing name/email typed into the form.
 * Nothing else from the browser is believed: the amount and currency are read
 * from the CRM here, on every call, so a tampered request cannot pay £1 against a
 * £1,000 invoice.
 */
import { NextResponse } from 'next/server';
import { getInvoice, isPayable, THIS_BRAND } from '@/lib/invoice';
import { getStripeClient, getStripeMode, getStripePublishableKey } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

type Body = { token?: string; name?: string; email?: string };

/** Stripe takes the smallest unit, and how small depends on the currency. */
const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG',
  'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);

function smallestUnit(amount: number, currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase())
    ? Math.round(amount)
    : Math.round(amount * 100);
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const token = (body.token ?? '').trim();
  if (!token) return NextResponse.json({ error: 'Missing payment link.' }, { status: 400 });

  const found = await getInvoice(token);
  if (!found.ok) {
    return NextResponse.json({ error: found.error }, { status: found.status });
  }
  const inv = found.invoice;

  const payable = isPayable(inv);
  if (!payable.ok) {
    return NextResponse.json({ error: payable.reason }, { status: 409 });
  }

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    console.error('[pay/intent]', err);
    return NextResponse.json(
      {
        error:
          'Card payments are not set up yet. Please contact us and we will send other details.',
      },
      { status: 503 },
    );
  }

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount: smallestUnit(inv.amount, inv.currency),
        currency: inv.currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        description: inv.reference || `Invoice for ${inv.customer}`,
        receipt_email: (body.email ?? '').trim() || undefined,
        // Both brands share one Stripe account, so every payment says which one it
        // belongs to. Without this the two are indistinguishable at month end.
        metadata: {
          brand: THIS_BRAND,
          brand_label: inv.brand,
          invoice_token: token,
          customer: inv.customer,
          billing_name: (body.name ?? '').trim().slice(0, 120),
        },
      },
      // Retrying the form must not raise a second charge for the same invoice.
      // The amount is part of the key on purpose: if the invoice is corrected in
      // the CRM, the next attempt must be a new intent rather than Stripe handing
      // back the one holding the old figure.
      { idempotencyKey: `inv_${token}_${inv.currency}_${smallestUnit(inv.amount, inv.currency)}` },
    );

    return NextResponse.json({
      clientSecret: intent.client_secret,
      publishableKey: getStripePublishableKey(),
      mode: getStripeMode(),
      amount: inv.amount,
      currency: inv.currency,
    });
  } catch (err) {
    console.error('[pay/intent] stripe refused', err);
    return NextResponse.json(
      { error: 'We could not start this payment. Please try again, or contact us.' },
      { status: 502 },
    );
  }
}
