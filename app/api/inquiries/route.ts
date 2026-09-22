import { eq } from 'drizzle-orm';
import { database } from '@/lib/server/db';
import { inquiries } from '@/db/schema';
import { inquirySchema } from '@/lib/inquiries';
import { json,fail,guardMutation,readBody,limitRequests,clientAddress,HttpError } from '@/lib/server/security';
export async function POST(req:Request){try{
 guardMutation(req);const parsed=inquirySchema.safeParse(await readBody(req));if(!parsed.success)throw new HttpError(400,'Check your name, email, consent, and project description (20–6,000 characters).');
 const v=parsed.data;if(v.website)throw new HttpError(400,'Please leave the website field empty.');
 await limitRequests(clientAddress(req)||v.email);
 const estimate=0,now=Date.now(),addons=JSON.stringify(v.addons);
 const inserted=await database().insert(inquiries)
  .values({id:v.id,name:v.name,email:v.email,idea:v.idea,addons,estimate,status:'new',notes:'',createdAt:now,updatedAt:now,version:1,consentAt:now})
  .onConflictDoNothing({target:inquiries.id}).returning({id:inquiries.id});
 // A repeated submission of the same reference is idempotent, but reusing that
 // reference with different content is not.
 if(!inserted.length){
  const [existing]=await database().select({email:inquiries.email,name:inquiries.name,idea:inquiries.idea,addons:inquiries.addons}).from(inquiries).where(eq(inquiries.id,v.id)).limit(1);
  if(!existing||existing.email!==v.email||existing.name!==v.name||existing.idea!==v.idea||existing.addons!==addons)throw new HttpError(409,'This request has changed. Please reopen the form and try again.');
 }
 return json({success:true,reference:v.id},201);
 }catch(e){return fail(e)}}
