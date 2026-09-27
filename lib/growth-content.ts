// Content for the industries, tools, comparison, engagement, security and
// automation-check surfaces. Plain and boundary-honest, like the rest of the
// site: no prices, no invented results, examples labelled as examples.

export type Industry = {
  slug: string; name: string; short: string; headline: string; intro: string;
  jobs: string[]; agents: { service: string; job: string }[];
  approval: string[]; tools: string[]; boundaries: string;
};

export const industries: Industry[] = [
  {
    slug: 'healthcare-medtech', name: 'Healthcare & MedTech', short: 'Clinics, practices and health-tech teams',
    headline: 'Less admin between patients, with a clinician on every decision.',
    intro: 'Appointment requests, intake forms, reminders and follow-up notes pile up around the clinical work. Agents prepare the paperwork and the replies; staff review anything that touches care or patient records.',
    jobs: ['Answering appointment and availability questions', 'Collecting intake details before a first visit', 'Sending reminders and rebooking no-shows', 'Summarising calls and messages for the care team'],
    agents: [{ service: 'voice-ai', job: 'Answers routine calls, books appointments and hands anything clinical to a person.' }, { service: 'ai-reply-agent', job: 'Drafts replies to scheduling and billing questions for staff approval.' }, { service: 'workflow-automation', job: 'Moves intake forms into your practice system and flags missing details.' }],
    approval: ['Any message that mentions symptoms, results or medication goes to a person, never a draft', 'Changes to patient records are proposed, not made', 'Every outbound message is approved by staff'],
    tools: ['Google Workspace', 'Microsoft 365', 'Twilio', 'Calendly', 'Your practice system via its API'],
    boundaries: 'Clinical advice is never automated. Health data, HIPAA or UK GDPR obligations, and the providers that may process patient information are agreed in writing before any build.',
  },
  {
    slug: 'sales-revenue', name: 'Sales & revenue teams', short: 'Owner-led sales and small sales teams',
    headline: 'Every lead answered, followed up and owned, without the evenings.',
    intro: 'Prospecting, first replies and follow-ups are the jobs that slip when the day fills up. Agents find and qualify leads, draft the replies and keep the pipeline current; you decide who hears from you and what they read.',
    jobs: ['Building weekly lists of businesses that match your best customers', 'Replying to inbound inquiries while they are still warm', 'Following up quotes that went quiet', 'Keeping the CRM current after every conversation'],
    agents: [{ service: 'lead-discovery', job: 'Finds, enriches and scores leads against your criteria, filed as unreviewed.' }, { service: 'ai-reply-agent', job: 'Drafts first replies and follow-ups for your approval.' }, { service: 'crm-pipeline-automation', job: 'Gives every open conversation an owner and a due next step.' }],
    approval: ['Nobody is contacted until you approve them', 'Each reply waits in your approval inbox', 'Campaigns only start when you switch them on'],
    tools: ['Twenty', 'HubSpot', 'Pipedrive', 'Salesforce', 'GoHighLevel', 'Gmail', 'Outlook'],
    boundaries: 'Outreach runs only from mailboxes you own, under sending limits and consent rules you agree. Data sources depend on the providers you choose and their terms.',
  },
  {
    slug: 'developer-tools-ai', name: 'Developer tools & AI', short: 'Software teams and technical founders',
    headline: 'Internal copilots that take the repetitive work off engineers.',
    intro: 'Support triage, release notes, documentation lookups and internal questions eat engineering time. Focused assistants work from your docs and tickets and hand their output to a person to check.',
    jobs: ['Triaging and labelling incoming support tickets', 'Answering internal questions from approved documentation', 'Drafting release notes and changelog entries', 'Summarising long threads into decisions and next steps'],
    agents: [{ service: 'ai-agents', job: 'Answers questions from an approved knowledge base with sources attached.' }, { service: 'integrations-reporting', job: 'Connects issue trackers, chat and docs so context is in one place.' }, { service: 'custom-software', job: 'Builds the internal tool when an off-the-shelf one does not fit.' }],
    approval: ['Drafts, labels and summaries are proposals until someone accepts them', 'Nothing merges, deploys or closes a ticket on its own', 'Answers cite the document they came from'],
    tools: ['GitHub', 'Linear', 'Jira', 'Slack', 'Notion', 'OpenAI', 'Anthropic Claude'],
    boundaries: 'Repository and ticket access is read-only unless agreed otherwise. Source code and credentials are never sent to a model provider without your written approval of that provider.',
  },
  {
    slug: 'marketing-agencies', name: 'Marketing & agencies', short: 'Agencies, in-house teams and marketing SaaS',
    headline: 'Briefs, approvals and reports that run on time without chasing.',
    intro: 'Content moves through ideas, briefs, drafts, client approval and scheduling, and reporting comes due every month. Automations carry the coordination; the creative judgement stays with your team.',
    jobs: ['Turning approved ideas into briefs and draft queues', 'Routing work to clients for approval and chasing gently', 'Scheduling approved posts and campaigns', 'Pulling monthly reports from several platforms'],
    agents: [{ service: 'content-operations', job: 'Keeps each piece moving from idea to approved publication.' }, { service: 'automation-reporting', job: 'Assembles client reports from the platforms you already use.' }, { service: 'email-campaigns', job: 'Runs approved sequences that stop the moment someone replies.' }],
    approval: ['Nothing publishes without the approval your process requires', 'Client-facing messages wait for your team', 'Reports are reviewed before they are sent'],
    tools: ['Notion', 'Airtable', 'Slack', 'Google Sheets', 'Meta and LinkedIn via approved access', 'HubSpot'],
    boundaries: 'Publishing depends on each platform’s permissions and API limits. We do not generate content presented as a named person without their approval.',
  },
  {
    slug: 'events-logistics', name: 'Events & logistics', short: 'Event organisers, venues and operations teams',
    headline: 'Vendors, schedules and updates coordinated in one place.',
    intro: 'Events and deliveries depend on dozens of confirmations from people who all use different tools. Automations collect the confirmations, keep the schedule current and tell you what is still open.',
    jobs: ['Collecting vendor confirmations and documents', 'Keeping a single schedule current as details change', 'Sending attendee and client updates', 'Flagging anything unconfirmed as the date approaches'],
    agents: [{ service: 'workflow-automation', job: 'Chases confirmations and files what comes back.' }, { service: 'ai-reply-agent', job: 'Drafts replies to routine attendee and vendor questions.' }, { service: 'custom-software', job: 'Builds a coordination portal when spreadsheets stop coping.' }],
    approval: ['Changes to the schedule are proposed for your sign-off', 'Attendee-wide messages are approved before sending', 'Payments and refunds always stay with a person'],
    tools: ['Google Sheets', 'Airtable', 'Slack', 'WhatsApp Business', 'Stripe', 'Calendly'],
    boundaries: 'Live on-site tracking and ticketing integrations depend on the providers involved and are scoped separately.',
  },
  {
    slug: 'ecommerce-retail', name: 'E-commerce & retail', short: 'Online stores and independent retailers',
    headline: 'Customer questions answered fast, orders kept moving.',
    intro: 'Where is my order, can I swap this, do you have it in blue: the same questions arrive all day. Agents look up the order and draft the answer; you approve anything involving a refund, exception or unhappy customer.',
    jobs: ['Answering order status and product questions', 'Handling returns and exchange requests', 'Recovering abandoned carts with approved messages', 'Summarising reviews and support themes each week'],
    agents: [{ service: 'ai-reply-agent', job: 'Drafts answers using the order record and your policies.' }, { service: 'email-campaigns', job: 'Sends approved follow-ups that stop on reply or purchase.' }, { service: 'automation-reporting', job: 'Shows open tickets, refunds and themes in one view.' }],
    approval: ['Refunds, discounts and exceptions always need a person', 'Complaints skip drafting and go straight to you', 'Campaigns start only when you switch them on'],
    tools: ['Shopify', 'WooCommerce', 'Stripe', 'Gmail', 'Klaviyo', 'Gorgias'],
    boundaries: 'Store and payment access is limited to what each workflow needs. Payment handling stays inside your payment provider.',
  },
  {
    slug: 'b2b-saas', name: 'B2B SaaS & platforms', short: 'Early-stage and growing software companies',
    headline: 'Onboarding, support and billing admin that keeps pace with signups.',
    intro: 'Every new account brings onboarding emails, support questions, usage check-ins and invoices. Automations handle the preparation so a small team can give each customer real attention.',
    jobs: ['Onboarding new accounts with the right next step', 'Drafting answers to repeat support questions', 'Spotting accounts that have gone quiet', 'Chasing failed payments politely'],
    agents: [{ service: 'ai-reply-agent', job: 'Drafts support replies from your docs for review.' }, { service: 'crm-pipeline-automation', job: 'Tracks trials, renewals and who owns each account.' }, { service: 'invoicing-automation', job: 'Drafts payment reminders on your schedule for approval.' }],
    approval: ['Account changes and credits are approved by a person', 'Customer-facing replies wait for review', 'Payment reminders go out only after approval'],
    tools: ['Stripe', 'Intercom', 'HubSpot', 'Twenty', 'Slack', 'Postgres'],
    boundaries: 'Access to production data is read-only and limited to agreed fields unless you decide otherwise in writing.',
  },
  {
    slug: 'real-estate', name: 'Real estate', short: 'Brokerages, agents and property managers',
    headline: 'Every property inquiry answered, qualified and booked.',
    intro: 'Listings bring calls and messages at all hours, most of them the same few questions. Voice and reply agents answer the routine ones, qualify the buyer or tenant and book the viewing; agents take over the conversations that matter.',
    jobs: ['Answering listing questions by phone and email', 'Qualifying buyers and tenants against your criteria', 'Booking viewings into the right calendar', 'Following up after viewings and open houses'],
    agents: [{ service: 'voice-ai', job: 'Answers routine property calls and passes qualified callers to an agent.' }, { service: 'ai-reply-agent', job: 'Drafts replies to listing inquiries with the right details.' }, { service: 'crm-pipeline-automation', job: 'Files every inquiry against the property and the person.' }],
    approval: ['Offers, pricing and negotiation always stay with an agent', 'Follow-ups are approved before sending', 'Callers can reach a person at any point'],
    tools: ['Twilio', 'Vapi', 'Google Calendar', 'Follow Up Boss', 'HubSpot', 'Twenty'],
    boundaries: 'Call recording, consent and fair-housing rules vary by region and are agreed before any voice agent goes live.',
  },
  {
    slug: 'legal', name: 'Legal', short: 'Law firms and legal teams',
    headline: 'Intake and document admin prepared, every judgement left to lawyers.',
    intro: 'New matter inquiries, conflict checks, document requests and scheduling take time away from legal work. Automations prepare and organise; qualified people make every decision and send every communication.',
    jobs: ['Collecting intake details for new matter inquiries', 'Requesting and filing documents from clients', 'Scheduling consultations', 'Summarising long correspondence for review'],
    agents: [{ service: 'workflow-automation', job: 'Turns intake forms into organised matter records.' }, { service: 'ai-agents', job: 'Summarises documents and correspondence for a lawyer to check.' }, { service: 'crm-pipeline-automation', job: 'Shows which inquiries are waiting and who owns them.' }],
    approval: ['No legal advice is ever drafted for sending', 'Every client communication is approved by the firm', 'Summaries are labelled as drafts for review'],
    tools: ['Microsoft 365', 'Google Workspace', 'Clio via its API', 'DocuSign', 'Calendly'],
    boundaries: 'Privileged material is only processed with providers the firm approves in writing. Professional conduct rules for your jurisdiction are reviewed before any build.',
  },
  {
    slug: 'finance-reporting', name: 'Finance & reporting', short: 'Accountants, bookkeepers and finance teams',
    headline: 'Get paid on time and see the numbers without the month-end scramble.',
    intro: 'Invoices, reminders, reconciliations and client reports repeat every month. Automations prepare them from your systems; you approve what goes to clients and what changes in the books.',
    jobs: ['Creating invoices from agreed work or deals', 'Sending payment reminders on a schedule', 'Chasing clients for missing documents', 'Assembling recurring reports from several systems'],
    agents: [{ service: 'invoicing-automation', job: 'Prepares invoices and reminders with payment links for approval.' }, { service: 'integrations-reporting', job: 'Pulls figures from your tools into one reporting view.' }, { service: 'workflow-automation', job: 'Requests and files documents from clients.' }],
    approval: ['Nothing is posted to the ledger without approval', 'Every reminder and report is reviewed before sending', 'Payments are never initiated by an agent'],
    tools: ['QuickBooks', 'Xero', 'Stripe', 'Google Sheets', 'Microsoft Excel', 'Dext'],
    boundaries: 'Financial data access is read-only unless agreed otherwise. Regulated activity and tax advice are outside what we automate.',
  },
];

export type ToolGroup = { group: string; tools: string[] };
export const toolGroups: ToolGroup[] = [
  { group: 'CRM', tools: ['Twenty', 'HubSpot', 'Salesforce', 'Pipedrive', 'GoHighLevel', 'Zoho CRM'] },
  { group: 'Email & chat', tools: ['Gmail', 'Outlook', 'Slack', 'Microsoft Teams', 'WhatsApp Business'] },
  { group: 'Voice & calendar', tools: ['Twilio', 'Vapi', 'ElevenLabs', 'Google Calendar', 'Calendly', 'Cal.com'] },
  { group: 'AI models', tools: ['OpenAI', 'Anthropic Claude', 'Google Gemini'] },
  { group: 'Automation', tools: ['n8n', 'Make', 'Zapier'] },
  { group: 'Money', tools: ['Stripe', 'QuickBooks', 'Xero'] },
  { group: 'Data & docs', tools: ['Google Sheets', 'Airtable', 'Notion', 'Postgres', 'Supabase'] },
];

export type Compare = { label: string; jinnx: string; diy: string; hire: string; consultancy: string };
export const comparison: Compare[] = [
  { label: 'Who builds and maintains it', jinnx: 'We do, with you', diy: 'You do, evenings and weekends', hire: 'No build; a person does the work', consultancy: 'A large team, on their timeline' },
  { label: 'Your time each week', jinnx: 'Approving drafts', diy: 'Building, fixing and approving', hire: 'Managing and reviewing', consultancy: 'Meetings and sign-offs' },
  { label: 'Approval before anything is sent', jinnx: 'Built in, on every workflow', diy: 'Only if you design it', hire: 'Depends on the person', consultancy: 'Depends on the project' },
  { label: 'Works outside office hours', jinnx: 'Yes, and waits for you', diy: 'Yes, when it works', hire: 'Only during their hours', consultancy: 'Yes' },
  { label: 'Handles judgement calls', jinnx: 'Routes them to you', diy: 'Usually not', hire: 'Yes, a real strength', consultancy: 'Routes them to you' },
  { label: 'Sized for an owner-run business', jinnx: 'That is the point', diy: 'Yes', hire: 'Yes', consultancy: 'Rarely' },
  { label: 'You own the accounts and code', jinnx: 'Yes', diy: 'Yes', hire: 'Not applicable', consultancy: 'Check the contract' },
];

export const engagement = [
  { name: 'Automation check', when: 'Week one', text: 'A short call and a written plan: which recurring job to hand over first, where you approve, and what the build needs from you.', free: true },
  { name: 'Pilot', when: 'First release', text: 'One agent on one job, connected to your accounts and your approval inbox. You use it for real before anything else is added.' },
  { name: 'Expand', when: 'When the pilot earns it', text: 'The next job joins the same approval inbox and CRM, so each new agent adds less for you to learn.' },
  { name: 'Ongoing care', when: 'On request', text: 'Monitoring, updates when your tools change their APIs, and adjustments as your business changes. Arranged separately if you want it.' },
];

export const securityPoints = [
  { title: 'Approval before anything consequential', text: 'Sending, publishing, changing a record and charging money wait for a person. Legal and complaint language skips drafting entirely and goes to you.' },
  { title: 'Your accounts, your data', text: 'Automations run on accounts you own. We ask for the narrowest access each workflow needs, and you can revoke it at any time from your own admin settings.' },
  { title: 'No training on your data', text: 'We do not use your data to train models, and we choose AI providers and plans whose terms exclude training on API data. You see the provider list before the build.' },
  { title: 'Every action logged', text: 'Drafts, approvals, rejections and sends are recorded with who did what and when. A pause switch stops all automated activity at once.' },
  { title: 'Only the fields that are needed', text: 'Each workflow reads the data it needs and nothing more. Retention is agreed per project, and project data is returned or deleted when the work ends.' },
  { title: 'Sensitive work is scoped separately', text: 'Health, legal and financial data, and any regulated workflow, are reviewed in writing before we build. We tell you plainly when something should not be automated.' },
];

export const securityFaq = [
  ['Do you hold certifications such as SOC 2 or ISO 27001?', 'No. We are a small agency and do not claim certifications we do not hold. We build on providers that do (hosting, databases, AI APIs), and we can list them for your review.'],
  ['Who can see our data?', 'Only the people working on your project, and only for the length of the project unless you arrange ongoing care. Access runs through your accounts, so you can see and revoke it.'],
  ['What happens if an automation makes a mistake?', 'Because consequential steps wait for approval, most mistakes are caught as drafts. Every action is logged, and the pause switch stops everything while we investigate.'],
  ['Can we use our own AI provider account?', 'Yes, and we recommend it. Usage is billed to you directly and your provider settings apply.'],
];

export type CheckTask = { key: string; label: string; hint: string; share: number; service: string };
// share: the part of this job that is preparation an agent can take on. The
// rest is the judgement and approval that stays with you. Illustrative only.
export const checkTasks: CheckTask[] = [
  { key: 'replies', label: 'Replying to inquiries and quote requests', hint: 'Reading, looking things up, writing the reply', share: .6, service: 'ai-reply-agent' },
  { key: 'followups', label: 'Following up leads and quotes', hint: 'Remembering who to chase and writing to them', share: .7, service: 'email-campaigns' },
  { key: 'prospecting', label: 'Finding new leads', hint: 'Searching, researching and building lists', share: .7, service: 'lead-discovery' },
  { key: 'crm', label: 'Updating the CRM or spreadsheets', hint: 'Copying details between tools', share: .8, service: 'crm-pipeline-automation' },
  { key: 'invoices', label: 'Invoicing and chasing payments', hint: 'Creating invoices, sending reminders', share: .6, service: 'invoicing-automation' },
  { key: 'calls', label: 'Answering routine calls and booking', hint: 'Availability questions, scheduling', share: .5, service: 'voice-ai' },
  { key: 'reporting', label: 'Pulling reports together', hint: 'Exporting, combining, formatting', share: .7, service: 'automation-reporting' },
];
