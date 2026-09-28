/**
 * The page a client opens from a payment link.
 *
 * The invoice itself lives in the CRM; this only reads it, by the 48-character
 * token in the URL. Nothing here is guessable and nothing but that one invoice is
 * ever returned, so the page needs no login — a client should never be asked to
 * make an account to pay a bill.
 *
 * Rendered fresh on every request: an invoice that has just been paid must not be
 * served from a cache still saying it is due.
 */
import type { Metadata } from 'next';
import { getInvoice, isPayable, type Invoice } from '@/lib/invoice';
import PayForm from './PayForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const found = await getInvoice(token);
  const inv = found.ok ? found.invoice : null;
  return {
    title: inv ? `Invoice · ${inv.brand}` : 'Invoice · Jinnx Automation',
    description: inv
      ? `${inv.symbol}${inv.amount.toLocaleString()} ${inv.currency} for ${inv.customer}`
      : 'Payment link',
    // A payment link gets pasted into email and chat; it should not be indexed.
    robots: { index: false, follow: false },
  };
}

/** Formats in the invoice's own currency, falling back if the runtime lacks it. */
function money(amount: number, currency: string, symbol: string) {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${symbol}${amount.toLocaleString()}`;
  }
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const found = await getInvoice(token);

  if (!found.ok) {
    return (
      <main className="pay-wrap">
        <div className="pay-card">
          <h1 className="pay-h1">This link cannot be opened</h1>
          <p className="pay-sub">{found.error}</p>
          <p className="pay-note">
            Reply to the email it came from and we will send a fresh one.
          </p>
        </div>
        <PayStyles />
      </main>
    );
  }

  const inv: Invoice = found.invoice;
  const payable = isPayable(inv);
  const amountLabel = money(inv.amount, inv.currency, inv.symbol);

  return (
    <main className="pay-wrap">
      <div className="pay-card">
        <header className="pay-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/jinnx-automation-logo.webp"
            alt=""
            width={38}
            height={38}
            className="pay-logo"
          />
          <span className="pay-brand">{inv.brand}</span>
          {inv.status === 'PAID' && <span className="pay-tag paid">Paid</span>}
          {inv.status === 'CANCELLED' && <span className="pay-tag dead">Cancelled</span>}
        </header>

        <p className="pay-for">Invoice for</p>
        <h1 className="pay-h1">{inv.customer}</h1>

        <div className="pay-amount">
          {amountLabel}
          <span className="pay-code">{inv.currency}</span>
        </div>

        {inv.reference && <p className="pay-ref">{inv.reference}</p>}

        {payable.ok ? (
          <PayForm
            token={token}
            customer={inv.customer}
            amountLabel={amountLabel}
            currency={inv.currency}
          />
        ) : (
          <p className="pay-sub">{payable.reason}</p>
        )}
      </div>

      <p className="pay-foot">{inv.brand}</p>
      <PayStyles />
    </main>
  );
}

/** Scoped to this page so it cannot disturb the marketing site's own styles. */
function PayStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
.pay-wrap{min-height:100svh;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:18px;padding:32px 16px;background:#faf7f1;color:#10252a;
  font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
.pay-card{width:100%;max-width:440px;background:#fff;border:1px solid #e6e3dc;
  border-radius:18px;padding:30px 28px 26px;
  box-shadow:0 1px 2px rgba(16,37,42,.04),0 10px 30px rgba(16,37,42,.06)}
.pay-top{display:flex;align-items:center;gap:10px;margin-bottom:22px}
.pay-logo{border-radius:9px;display:block}
.pay-brand{font-weight:600;font-size:14.5px;letter-spacing:-.01em}
.pay-tag{margin-left:auto;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:999px}
.pay-tag.paid{background:#e7f5ec;color:#186c3b}
.pay-tag.dead{background:#f0eee8;color:#687577}
.pay-for{margin:0;font-size:12.5px;color:#687577}
.pay-h1{margin:2px 0 18px;font-size:21px;font-weight:600;letter-spacing:-.02em;line-height:1.25}
.pay-amount{display:flex;align-items:baseline;gap:9px;font-size:42px;font-weight:700;
  letter-spacing:-.035em;font-variant-numeric:tabular-nums;line-height:1}
.pay-code{font-size:13px;font-weight:600;color:#687577;letter-spacing:0}
.pay-ref{margin:12px 0 0;font-size:13px;color:#687577}
.pay-sub{margin:18px 0 0;font-size:13.5px;line-height:1.6;color:#687577}
.pay-note{margin:12px 0 0;font-size:12.5px;line-height:1.6;color:#687577}
.pay-foot{margin:0;font-size:12px;color:#8b9698}

/* Card form */
.pay-form{margin-top:24px;border-top:1px solid #efece5;padding-top:22px}
.pay-fields{display:grid;gap:12px;margin-bottom:18px}
.pay-field{display:grid;gap:6px}
.pay-field span{font-size:12px;font-weight:600;color:#4c5b5e}
.pay-field input{width:100%;box-sizing:border-box;padding:11px 12px;font:inherit;font-size:15px;
  color:#10252a;background:#fff;border:1px solid #dcd8d0;border-radius:10px;
  transition:border-color .14s,box-shadow .14s}
.pay-field input::placeholder{color:#9aa4a6}
.pay-field input:focus{outline:none;border-color:#10252a;box-shadow:0 0 0 3px rgba(16,37,42,.08)}
.pay-element{min-height:96px}
.pay-btn{display:block;width:100%;margin-top:20px;padding:13px 18px;border:0;border-radius:11px;
  text-align:center;background:#f5ce00;color:#161616;font:inherit;font-weight:700;font-size:14.5px;
  cursor:pointer;box-shadow:0 7px 18px rgba(197,168,0,.18);transition:background .14s,box-shadow .14s}
.pay-btn:hover:not(:disabled){background:#ffe124;box-shadow:0 10px 23px rgba(186,160,0,.22)}
.pay-btn:disabled{background:#efece5;color:#9aa4a6;box-shadow:none;cursor:default}
.pay-error{margin:14px 0 0;font-size:13px;line-height:1.55;color:#b4291b}
.pay-done{margin-top:24px;display:flex;gap:11px;align-items:flex-start;
  background:#e7f5ec;color:#186c3b;border-radius:12px;padding:16px 16px 15px}
.pay-done svg{flex:none;margin-top:1px}
.pay-done p{margin:0;font-size:13.5px;line-height:1.6}
.pay-blocked{margin-top:22px;border-top:1px solid #efece5;padding-top:18px}
.pay-blocked p:first-child{margin:0;font-size:13.5px;line-height:1.6;color:#b4291b}

@media(max-width:420px){.pay-amount{font-size:34px}.pay-card{padding:24px 20px 22px}}
`,
      }}
    />
  );
}
