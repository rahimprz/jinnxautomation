// The team: one person who signs off, and the AI employees who prepare the work.
// Each agent maps to a real service page and states what it never does.

export const owner = {
  // Add a name and a photo (public/images/…) when you want them on the site.
  name: '' as string,
  photo: '' as string,
  title: 'Founder · the human in the loop',
  bio: 'Scopes every project, signs off every agent before it goes live, and reads every inquiry personally. Nothing we build sends, publishes or charges without a person, and on our side that person is the founder.',
  duties: ['Reads and answers every inquiry', 'Approves each agent before launch', 'Owns the handoff and the support'],
};

export type Agent = { name: string; role: string; service: string; does: string; never: string; shift: string };

export const agents: Agent[] = [
  { name: 'Scout', role: 'Lead researcher', service: 'lead-discovery', does: 'Finds businesses that match your best customers, enriches and scores them, and files each one with a reason.', never: 'Contacts anyone before you approve them.', shift: 'Weekly lists' },
  { name: 'Quill', role: 'Reply writer', service: 'ai-reply-agent', does: 'Reads each inquiry, checks it, and drafts one reply in your voice from your approved facts.', never: 'Sends a single email on its own.', shift: 'Every new message' },
  { name: 'Relay', role: 'Pipeline keeper', service: 'crm-pipeline-automation', does: 'Turns inquiries into CRM records with an owner and a next step, and flags anything going stale.', never: 'Deletes or overwrites your records.', shift: 'Always on' },
  { name: 'Cadence', role: 'Follow-up coordinator', service: 'email-campaigns', does: 'Runs approved sequences from your own mailbox and stops the moment someone replies.', never: 'Starts a campaign you have not switched on.', shift: 'On your schedule' },
  { name: 'Echo', role: 'Receptionist', service: 'voice-ai', does: 'Answers routine calls, books appointments, and hands anything sensitive to a person.', never: 'Pretends to be human or handles a complaint.', shift: 'After hours, weekends' },
  { name: 'Ledger', role: 'Accounts assistant', service: 'invoicing-automation', does: 'Prepares invoices with payment links and drafts polite reminders on your cadence.', never: 'Moves money or posts to your books.', shift: 'Month end, and daily' },
  { name: 'Beacon', role: 'Operations lead', service: 'automation-reporting', does: 'Keeps one view of what is waiting, moving or stuck, and pauses everything if something fails.', never: 'Hides an error or a failed send.', shift: 'Every morning' },
];

export type Testimonial = { quote: string; name: string; role: string; company: string; industry: string; example?: boolean };

// Examples show on preview deployments only, each marked "Example". Production
// shows only entries without `example: true`; add real ones here to publish them.
export const testimonials: Testimonial[] = [
  { example: true, quote: 'I used to spend Sunday evenings answering quote requests. Now the drafts are waiting on Monday morning and I just approve them.', name: 'Sample client', role: 'Owner', company: 'Landscaping business', industry: 'Home services' },
  { example: true, quote: 'What sold me was the hold step. Nothing goes to a customer until one of us has read it, and the CRM finally keeps itself up to date.', name: 'Sample client', role: 'Managing partner', company: 'Accounting practice', industry: 'Finance' },
  { example: true, quote: 'Calls after six used to go to voicemail. Now they are answered, booked, and the summary is in the CRM before I get to my desk.', name: 'Sample client', role: 'Broker', company: 'Property agency', industry: 'Real estate' },
];
