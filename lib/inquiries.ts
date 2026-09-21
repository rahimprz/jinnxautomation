import { z } from 'zod';
export const addonPrices=[1000,1500,500,300,250,400];
export const addonNames=['Advanced AI features','Mobile apps','Custom dashboard','API integration','Launch roadmap','Product Hunt prep'];
export const statuses=['new','contacted','qualified','closed','archived'] as const;
export const inquirySchema=z.object({id:z.string().uuid(),name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),idea:z.string().trim().min(20).max(6000),addons:z.array(z.number().int().min(0).max(5)).max(6).refine(v=>new Set(v).size===v.length),consent:z.literal(true),website:z.string().max(200).optional()}).strict();
export const updateSchema=z.object({status:z.enum(statuses),notes:z.string().max(5000),version:z.number().int().positive()}).strict();
export type Inquiry={id:string;name:string;email:string;idea:string;addons:string;estimate:number;status:typeof statuses[number];notes:string;created_at:number;updated_at:number;version:number};
export function csvCell(v:string|number){const text=String(v);return '"'+(/^[\s]*[=+@\-]/.test(text)?"'"+text:text).replace(/"/g,'""')+'"';}
