import { z } from 'zod';
// Pricing is never shown or computed on this site.
export const addonNames=['AI agents for replies and research','Lead discovery and CRM pipeline','Workflow automation','Email campaigns and follow-up','Invoicing and reporting','Custom software or product launch'];
export const statuses=['new','contacted','qualified','closed','archived'] as const;
export const inquirySchema=z.object({id:z.string().uuid(),name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),idea:z.string().trim().min(20).max(6000),addons:z.array(z.number().int().min(0).max(5)).max(6).refine(v=>new Set(v).size===v.length),consent:z.literal(true),phone:z.string().trim().max(40).optional(),website:z.string().max(200).optional()}).strict();
export const updateSchema=z.object({status:z.enum(statuses),notes:z.string().max(5000),version:z.number().int().positive()}).strict();
export type Inquiry={id:string;name:string;email:string;idea:string;addons:string;estimate:number;status:typeof statuses[number];notes:string;created_at:number;updated_at:number;version:number;phone?:string|null};
export function csvCell(v:string|number){const text=String(v);return '"'+(/^[\s]*[=+@\-]/.test(text)?"'"+text:text).replace(/"/g,'""')+'"';}
