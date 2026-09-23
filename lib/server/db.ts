import { getDb } from '@/db';
import { inquiries } from '@/db/schema';
export type { Database } from '@/db';
export function database(){return getDb();}
// D1's `SELECT *` returned snake_case columns and `lib/inquiries.ts` `Inquiry`
// still describes that shape, so select explicit aliases rather than Drizzle's
// camelCase properties. `consent_at` stays server-side.
export const inquiryColumns={
 id:inquiries.id,name:inquiries.name,email:inquiries.email,idea:inquiries.idea,
 addons:inquiries.addons,estimate:inquiries.estimate,status:inquiries.status,
 notes:inquiries.notes,created_at:inquiries.createdAt,updated_at:inquiries.updatedAt,
 version:inquiries.version,phone:inquiries.phone,
};
