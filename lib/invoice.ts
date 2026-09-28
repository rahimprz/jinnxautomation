/**
 * The invoice behind a payment link.
 *
 * The CRM is the only source of truth for what is owed. The browser is trusted
 * for exactly one thing — the token in the URL — and never for the amount, the
 * currency, or whether the invoice is still payable. Each of those is read again
 * from the CRM on every request, the same rule the Book Press site follows.
 */

const LOOKUP =
  process.env.INVOICE_LOOKUP_URL ?? 'https://automation.hibestow.com/pay/';
const MARK_PAID =
  process.env.INVOICE_PAID_URL ?? 'https://automation.hibestow.com/paid/';

/** Only invoices raised under this brand may be paid here. */
export const THIS_BRAND = 'automation';

export type Invoice = {
  customer: string;
  reference: string;
  amount: number;
  currency: string;
  symbol: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'DRAFT' | 'CANCELLED';
  brand: string;
  brand_key: string;
};

export type Lookup =
  | { ok: true; invoice: Invoice }
  | { ok: false; status: number; error: string };

/** A token is hex of a known length; anything else never reaches the CRM. */
export function looksLikeToken(token: string): boolean {
  return /^[0-9a-f]{24,96}$/.test(token);
}

export async function getInvoice(token: string): Promise<Lookup> {
  if (!looksLikeToken(token)) {
    return { ok: false, status: 404, error: 'This payment link is not valid.' };
  }
  let res: Response;
  try {
    res = await fetch(LOOKUP + encodeURIComponent(token), {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
  } catch {
    // The CRM being unreachable is our problem, not the customer's, and it is
    // temporary - so it must not read as "your link is wrong".
    return {
      ok: false,
      status: 503,
      error: 'We cannot reach our billing system just now. Please try again shortly.',
    };
  }
  if (res.status === 404) {
    return { ok: false, status: 404, error: 'This payment link is not valid.' };
  }
  if (!res.ok) {
    return {
      ok: false,
      status: 503,
      error: 'Could not load this invoice. Please try again shortly.',
    };
  }
  const data = (await res.json()) as Partial<Invoice> & { ok?: boolean };
  if (!data?.ok) {
    return { ok: false, status: 404, error: 'This payment link is not valid.' };
  }

  // A Book Press link must not be payable here, nor an Automation link there: the
  // two brands bill separately, and a payment landing under the wrong one is a
  // reconciliation problem nobody notices until month end.
  if (data.brand_key !== THIS_BRAND) {
    return {
      ok: false,
      status: 403,
      error:
        'This payment link belongs to another Jinnx website. Please use the link in your invoice email.',
    };
  }
  return { ok: true, invoice: data as Invoice };
}

export function isPayable(inv: Invoice): { ok: boolean; reason?: string } {
  if (inv.status === 'PAID') return { ok: false, reason: 'This invoice has already been paid.' };
  if (inv.status === 'CANCELLED') return { ok: false, reason: 'This invoice was cancelled.' };
  if (inv.status === 'DRAFT')
    return { ok: false, reason: 'This invoice is not ready to be paid yet.' };
  if (!(inv.amount > 0)) return { ok: false, reason: 'This invoice has no amount to pay.' };
  return { ok: true };
}

/**
 * Tell the CRM the invoice is settled. Called only from the Stripe webhook, after
 * the PaymentIntent has been re-fetched from Stripe — never from the browser, and
 * never on the strength of the event body alone.
 */
export async function markInvoicePaid(
  token: string,
  paymentIntentId: string,
): Promise<boolean> {
  const secret = process.env.INVOICE_WRITE_SECRET || '';
  if (!secret) {
    console.error('[pay] INVOICE_WRITE_SECRET is not set; cannot mark the invoice paid');
    return false;
  }
  try {
    const r = await fetch(MARK_PAID + encodeURIComponent(token), {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ payment_intent: paymentIntentId }),
    });
    return r.ok;
  } catch (err) {
    console.error('[pay] could not mark the invoice paid', err);
    return false; // the webhook returns non-2xx so Stripe retries
  }
}
