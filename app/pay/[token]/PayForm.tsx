'use client';

/**
 * The card form on a payment link.
 *
 * Elements is mounted imperatively rather than through @stripe/react-stripe-js,
 * the same way the Book Press page does it: a Stripe Element renders into a DOM
 * node Stripe itself owns, so React is not the right thing to put in charge of
 * that subtree. Keeping both brands on one approach also means a fix to one is a
 * fix I can read across to the other.
 *
 * What this component is trusted with: the payer's name and email, and nothing
 * else. The amount, the currency and whether the invoice is still payable are
 * decided by the server on every call — see app/api/pay/intent.
 */

import { useEffect, useRef, useState } from 'react';
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';

type Props = {
  token: string;
  customer: string;
  amountLabel: string;
  currency: string;
};

type Status = 'loading' | 'ready' | 'paying' | 'done' | 'blocked';

export default function PayForm({ token, customer, amountLabel, currency }: Props) {
  const [name, setName] = useState(customer);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const stripeRef = useRef<Stripe | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);
  const mountNode = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  // Read only at the two moments that matter — creating the intent and confirming
  // it — so typing does not rebuild the callbacks on every keystroke.
  const fieldsRef = useRef({ name, email });
  fieldsRef.current = { name, email };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      // A payer coming back from a bank's 3-D Secure page arrives with the intent
      // in the URL; finish that one rather than starting a second payment.
      const returning = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret',
      );

      let res: Response;
      try {
        res = await fetch('/api/pay/intent', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token, email: fieldsRef.current.email }),
        });
      } catch {
        setStatus('blocked');
        setError('We could not reach the payment service. Please refresh and try again.');
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.clientSecret || !data?.publishableKey) {
        setStatus('blocked');
        setError(data?.error || 'Card payment is unavailable just now. Please contact us.');
        return;
      }

      const stripe = await loadStripe(data.publishableKey);
      if (!stripe) {
        setStatus('blocked');
        setError('Could not load the payment form. Please refresh and try again.');
        return;
      }
      stripeRef.current = stripe;

      if (returning) {
        await resume(stripe, returning);
        return;
      }

      const elements = stripe.elements({
        clientSecret: data.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#10252a',
            colorText: '#10252a',
            colorDanger: '#b4291b',
            borderRadius: '10px',
            fontSizeBase: '15px',
            fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
          },
        },
      });
      const paymentElement = elements.create('payment', {
        layout: { type: 'tabs', defaultCollapsed: false },
        defaultValues: {
          billingDetails: { name: fieldsRef.current.name, email: fieldsRef.current.email },
        },
      });
      elementsRef.current = elements;
      if (mountNode.current) paymentElement.mount(mountNode.current);
      paymentElement.on('ready', () => setStatus('ready'));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Pick up a payment that went off to a bank's own page and came back. */
  async function resume(stripe: Stripe, clientSecret: string) {
    setMessage('Checking your payment…');
    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    if (!paymentIntent) {
      setStatus('blocked');
      setError('We could not check that payment. Please contact us before trying again.');
      return;
    }
    if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
      await finish(paymentIntent.id);
      return;
    }
    setStatus('blocked');
    setError(
      `That payment was not completed (${paymentIntent.status}). Please reload the page to try again.`,
    );
  }

  /** Have the server verify with Stripe and record it against the invoice. */
  async function finish(paymentIntentId: string) {
    try {
      const res = await fetch('/api/pay/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, payment_intent_id: paymentIntentId }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success || data?.processing) {
        setStatus('done');
        setMessage(data.message || 'Thank you. Your payment has been received.');
        return;
      }
      setStatus('ready');
      setError(data?.error || 'We could not confirm that payment. Please contact us.');
    } catch {
      // The charge itself may well have gone through, so never invite a second one.
      setStatus('done');
      setMessage(
        'Your payment went through, but we could not reach our system to record it. ' +
          'We will confirm by email — please do not pay again.',
      );
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements || status !== 'ready') return;

    setStatus('paying');
    setError('');

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pay/${encodeURIComponent(token)}`,
        // The intent is created before the payer has typed anything, so the
        // receipt address is attached here instead of at creation.
        receipt_email: fieldsRef.current.email || undefined,
        payment_method_data: {
          billing_details: {
            name: fieldsRef.current.name || undefined,
            email: fieldsRef.current.email || undefined,
          },
        },
      },
      // Only the methods that genuinely need a bank's own page leave the site.
      redirect: 'if_required',
    });

    if (result.error) {
      setStatus('ready');
      setError(result.error.message ?? 'That payment did not go through. Please try again.');
      return;
    }
    await finish(result.paymentIntent.id);
  }

  if (status === 'done') {
    return (
      <div className="pay-done" role="status">
        <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
          <path
            d="M20 6 9 17l-5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p>{message}</p>
      </div>
    );
  }

  if (status === 'blocked') {
    return (
      <div className="pay-blocked" role="alert">
        <p>{error}</p>
        <p className="pay-note">
          You can also reply to the email this link came from and we will send payment
          details for {currency}.
        </p>
      </div>
    );
  }

  return (
    <form className="pay-form" onSubmit={onSubmit} noValidate>
      <div className="pay-fields">
        <label className="pay-field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Your name"
          />
        </label>
        <label className="pay-field">
          <span>Email for the receipt</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>
      </div>

      <div ref={mountNode} className="pay-element" />
      {status === 'loading' && (
        <p className="pay-note">{message || 'Loading payment options…'}</p>
      )}

      {error && (
        <p className="pay-error" role="alert">
          {error}
        </p>
      )}

      <button className="pay-btn" type="submit" disabled={status !== 'ready'}>
        {status === 'paying' ? 'Processing…' : `Pay ${amountLabel}`}
      </button>
      <p className="pay-note">
        Card details go straight to Stripe and are never seen by us. Payments are taken in{' '}
        {currency}.
      </p>
    </form>
  );
}
