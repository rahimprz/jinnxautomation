import type { ReactNode } from 'react';

// Bump when either document changes.
export const LEGAL_UPDATED='26 September 2026';

const EMAIL=<a href="mailto:info@jinnxautomation.com">info@jinnxautomation.com</a>;
const Section=({title,children}:{title:string;children:ReactNode})=><section><h3>{title}</h3>{children}</section>;

export function PrivacyPolicy(){
 return <>
  <p><strong>Last updated: {LEGAL_UPDATED}</strong></p>
  <p>This policy explains how Jinnx Automation (&ldquo;Jinnx&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, and protects personal information when you visit jinnxautomation.com, send us an inquiry, or work with us as a client. We have offices at 1016 W Jackson Blvd, Chicago, IL 60607, United States and 3 Fitzroy Pl, Finnieston, Glasgow G3 7RH, United Kingdom. For UK and EU data protection law, Jinnx Automation is the controller of the personal information described here.</p>

  <Section title="1. Information we collect">
   <p><strong>Information you give us.</strong> When you submit the inquiry form we collect your name, email address, phone number (optional), your project description, the services or add-ons you selected, the estimate shown to you, and the time you gave consent. If you email or call us, we keep that correspondence.</p>
   <p><strong>Information collected automatically.</strong> To block spam and abuse, our server reads your IP address when you submit a form. It is converted into a one-way hash and kept for about 20 minutes to count requests; we do not store the raw address with your inquiry. Our hosting provider also keeps standard server logs, such as IP address, browser type, and pages requested, for security and reliability.</p>
   <p><strong>Client project data.</strong> When we build an automation for you, we may process data held in your systems, such as CRM records, mailboxes, or invoices. We process that data on your instructions under the agreement we sign with you, as your processor or service provider, not for our own purposes.</p>
  </Section>

  <Section title="2. How we use your information">
   <ul>
    <li>To reply to your inquiry, prepare a proposal, and talk with you about your project.</li>
    <li>To deliver, support, and invoice services you have agreed to.</li>
    <li>To keep the website secure, prevent spam and abuse, and fix problems.</li>
    <li>To meet legal, tax, and accounting obligations.</li>
   </ul>
   <p>Submitting an inquiry does not sign you up for marketing. We do not sell your personal information, share it for cross-context behavioral advertising, or use it to make automated decisions that have legal or similarly significant effects on you.</p>
  </Section>

  <Section title="3. Legal bases (UK and EEA visitors)">
   <p>We process your information because you asked us to take steps before entering a contract (answering your inquiry), to perform a contract with you, for our legitimate interests in running and securing our business, and to comply with legal obligations. Where we rely on your consent, you can withdraw it at any time.</p>
  </Section>

  <Section title="4. AI and your data">
   <p>We do not use your inquiry or your client data to train AI models. Where a project uses third-party AI providers, we use business or API terms under which your data is not used for model training, and we tell you which providers are involved before the build begins. AI features we build include human review steps you agree to in the project scope.</p>
  </Section>

  <Section title="5. Who we share information with">
   <p>We share information only with service providers that help us run our business, under contracts that require them to protect it:</p>
   <ul>
    <li><strong>Vercel</strong> hosts the website and processes server logs.</li>
    <li><strong>Our database provider</strong> stores inquiries on our behalf.</li>
    <li><strong>Google Fonts</strong> serves the fonts on this site, so Google receives your IP address and browser details when a page loads.</li>
    <li><strong>Email, telephone, accounting, and payment providers</strong> we use to communicate with you and bill for our services.</li>
    <li><strong>Tools approved in a client project</strong>, only as that project&rsquo;s scope sets out.</li>
   </ul>
   <p>We may also disclose information if the law requires it, to protect our rights or the safety of others, or as part of a merger or sale of the business, in which case this policy continues to apply.</p>
  </Section>

  <Section title="6. International transfers">
   <p>We operate in the United States and the United Kingdom, and our providers may process data in other countries. Where UK or EEA personal information is transferred to a country without an adequacy decision, we rely on appropriate safeguards such as the UK International Data Transfer Addendum or the EU Standard Contractual Clauses.</p>
  </Section>

  <Section title="7. How long we keep information">
   <ul>
    <li>Inquiries that do not become a project: up to 24 months after our last contact, then deleted.</li>
    <li>Client records, contracts, and invoices: for as long as the law requires, usually six to seven years.</li>
    <li>Rate-limit hashes: about 20 minutes.</li>
    <li>Client project data: as set out in your agreement, and returned or deleted when the project ends.</li>
   </ul>
  </Section>

  <Section title="8. Cookies">
   <p>The public website does not set advertising or analytics cookies. The only cookie we use is a strictly necessary session cookie for our private admin inbox, which visitors do not see. If we add analytics or other cookies later, we will update this policy and ask for consent where the law requires it.</p>
  </Section>

  <Section title="9. Security">
   <p>Access to inquiries is limited to authorized staff behind a password and a signed, HttpOnly session cookie. Data travels over HTTPS, and form submissions are checked and rate-limited. No system is perfectly secure, so please do not send passwords or sensitive customer information through the inquiry form.</p>
  </Section>

  <Section title="10. Your rights">
   <p>Depending on where you live, you may have the right to access, correct, delete, or receive a copy of your personal information, to object to or restrict how we use it, and to withdraw consent.</p>
   <p><strong>UK and EEA:</strong> you also have the right to complain to a data protection authority. In the UK that is the Information Commissioner&rsquo;s Office (ico.org.uk).</p>
   <p><strong>California and other US states:</strong> you may have the right to know what we collect, to delete or correct it, and to opt out of sale or sharing. We do not sell or share personal information, and we will not treat you differently for exercising your rights.</p>
   <p>To make a request, email {EMAIL}. We may need to verify your identity, and we respond within the time the law allows, normally one month.</p>
  </Section>

  <Section title="11. Children">
   <p>Our services are for businesses. We do not knowingly collect personal information from anyone under 16. If you believe a child has sent us information, contact us and we will delete it.</p>
  </Section>

  <Section title="12. Changes to this policy">
   <p>We may update this policy as our services change. We will change the date at the top, and for significant changes we will tell clients directly.</p>
  </Section>

  <Section title="13. Contact us">
   <p>Email {EMAIL}, call <a href="tel:+18884863840">+1 888 486 3840</a> (US) or <a href="tel:+442033497819">+44 20 3349 7819</a> (UK), or write to either office address above.</p>
  </Section>
 </>;
}

export function TermsOfService(){
 return <>
  <p><strong>Last updated: {LEGAL_UPDATED}</strong></p>
  <p>These terms apply to your use of jinnxautomation.com (the &ldquo;site&rdquo;), operated by Jinnx Automation (&ldquo;Jinnx&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site you agree to them. If you do not agree, please do not use the site.</p>

  <Section title="1. Our services and client agreements">
   <p>We design and build AI agents, workflow automation, CRM and sales systems, voice AI, integrations, and custom software. Paid work is governed by a separate written agreement, such as a proposal, statement of work, or master services agreement, signed by both parties. If that agreement conflicts with these terms, the agreement wins.</p>
  </Section>

  <Section title="2. Inquiries, estimates, and pricing">
   <p>Submitting the inquiry form, using the plan builder, or receiving an estimate does not create a contract, reserve availability, or oblige either party to proceed. Prices, timelines, and package contents on the site are indicative only. Final scope, fees, and timing are confirmed in writing before any work starts.</p>
  </Section>

  <Section title="3. Examples and results">
   <p>Case studies, use cases, and portfolio entries on the site show what our services can do. Some are illustrative concepts rather than completed client projects. Results depend on your business, data, and tools, so we do not guarantee any particular outcome, saving, or revenue.</p>
  </Section>

  <Section title="4. AI output">
   <p>AI systems can make mistakes. Unless your agreement says otherwise, anything an AI feature drafts, scores, or recommends should be reviewed by a person before it is relied on or sent. You remain responsible for decisions made using AI output, and for having the rights and consents needed for the data you ask us to process, including consent for calls, recordings, and marketing messages.</p>
  </Section>

  <Section title="5. Third-party services">
   <p>Our work often connects to third-party platforms such as CRMs, email and telephony providers, AI model providers, and payment processors. Those services have their own terms, pricing, and availability, which we do not control. You are responsible for your accounts and fees with those providers unless your agreement says otherwise.</p>
  </Section>

  <Section title="6. Acceptable use">
   <p>You agree not to misuse the site. That includes sending spam, submitting false information, trying to access restricted areas such as the admin inbox, interfering with the site&rsquo;s security or performance, or scraping it in a way that burdens our systems.</p>
  </Section>

  <Section title="7. Intellectual property">
   <p>The site&rsquo;s content, design, logo, and code belong to Jinnx Automation or its licensors. You may view and share pages for personal or internal business use, but you may not copy, resell, or republish them without our permission. Ownership of work we build for clients is set out in each client agreement.</p>
  </Section>

  <Section title="8. Confidentiality">
   <p>We treat project details you share with us as confidential and use them only to assess and deliver your project. We are happy to sign a mutual NDA before detailed discussions. Please do not send passwords, payment details, or sensitive personal data through the inquiry form.</p>
  </Section>

  <Section title="9. Disclaimers">
   <p>The site and its content are provided &ldquo;as is&rdquo; for general information. We work to keep it accurate and available but do not promise that it is error-free, complete, or uninterrupted. Nothing on the site is legal, financial, or professional advice.</p>
  </Section>

  <Section title="10. Limitation of liability">
   <p>To the extent the law allows, Jinnx is not liable for any indirect, incidental, or consequential loss, or loss of profits, revenue, or data, arising from your use of the site. Our total liability relating to the site is limited to US $100 (or £100). Nothing in these terms limits liability that cannot be limited by law, such as for death or personal injury caused by negligence, or for fraud.</p>
  </Section>

  <Section title="11. Indemnity">
   <p>You agree to indemnify Jinnx against claims arising from your misuse of the site or your breach of these terms.</p>
  </Section>

  <Section title="12. Links to other sites">
   <p>The site may link to websites we do not control. We are not responsible for their content or practices.</p>
  </Section>

  <Section title="13. Privacy">
   <p>How we handle personal information is explained in our <a href="/privacy">Privacy Policy</a>.</p>
  </Section>

  <Section title="14. Governing law">
   <p>If you are based in the United Kingdom, these terms are governed by the laws of Scotland and the Scottish courts have jurisdiction. Otherwise, they are governed by the laws of the State of Illinois, USA, and the state and federal courts in Cook County, Illinois have jurisdiction. This does not remove any consumer protections you have under the law where you live.</p>
  </Section>

  <Section title="15. Changes">
   <p>We may update these terms from time to time. The date at the top shows the latest version, and continuing to use the site after a change means you accept it.</p>
  </Section>

  <Section title="16. Contact">
   <p>Questions about these terms: {EMAIL}, <a href="tel:+18884863840">+1 888 486 3840</a> (US), or <a href="tel:+442033497819">+44 20 3349 7819</a> (UK).</p>
  </Section>
 </>;
}
