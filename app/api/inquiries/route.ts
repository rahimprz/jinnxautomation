import { database } from '@/lib/server/db';
import { inquirySchema,addonPrices } from '@/lib/inquiries';
import { json,fail,guardMutation,readBody,limitRequests,HttpError } from '@/lib/server/security';
export async function POST(req:Request){try{
 guardMutation(req);const parsed=inquirySchema.safeParse(await readBody(req));if(!parsed.success)throw new HttpError(400,'Check your name, email, consent, and project description (20–6,000 characters).');
 const v=parsed.data;if(v.website)throw new HttpError(400,'Please leave the website field empty.');
 await limitRequests(req.headers.get('cf-connecting-ip')||v.email);
 const estimate=10999+v.addons.reduce((sum,i)=>sum+addonPrices[i],0),now=Date.now();
 const result=await database().prepare('INSERT OR IGNORE INTO inquiries (id,name,email,idea,addons,estimate,status,notes,created_at,updated_at,version,consent_at) VALUES (?,?,?,?,?,?,\'new\',\'\',?,?,1,?)').bind(v.id,v.name,v.email,v.idea,JSON.stringify(v.addons),estimate,now,now,now).run();
 if(!result.meta.changes){const existing=await database().prepare('SELECT email,name,idea,addons FROM inquiries WHERE id = ?').bind(v.id).first<{email:string;name:string;idea:string;addons:string}>();if(!existing||existing.email!==v.email||existing.name!==v.name||existing.idea!==v.idea||existing.addons!==JSON.stringify(v.addons))throw new HttpError(409,'This request has changed. Please reopen the form and try again.');}
 return json({success:true,reference:v.id},201);
 }catch(e){return fail(e)}}
