import { and, eq, sql } from 'drizzle-orm';
import { database, inquiryColumns } from '@/lib/server/db';
import { inquiries } from '@/db/schema';
import { updateSchema } from '@/lib/inquiries';
import { json,fail,requireAdmin,guardMutation,readBody,HttpError } from '@/lib/server/security';
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){try{
 guardMutation(req);await requireAdmin();const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))throw new HttpError(400,'Invalid inquiry.');const parsed=updateSchema.safeParse(await readBody(req));if(!parsed.success)throw new HttpError(400,'Check the status and notes.');const v=parsed.data;
 // Matching on the caller's version is what makes a stale inbox tab fail
 // instead of silently overwriting a newer edit.
 const [row]=await database().update(inquiries)
  .set({status:v.status,notes:v.notes,updatedAt:Date.now(),version:sql`${inquiries.version} + 1`})
  .where(and(eq(inquiries.id,id),eq(inquiries.version,v.version)))
  .returning(inquiryColumns);
 if(!row)throw new HttpError(409,'This inquiry changed in another session. Refresh the inbox before saving.');return json({inquiry:row});
 }catch(e){return fail(e)}}
