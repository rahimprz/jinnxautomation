import { database } from '@/lib/server/db';
import { updateSchema } from '@/lib/inquiries';
import { json,fail,requireAdmin,guardMutation,readBody,HttpError } from '@/lib/server/security';
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){try{
 guardMutation(req);await requireAdmin();const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))throw new HttpError(400,'Invalid inquiry.');const parsed=updateSchema.safeParse(await readBody(req));if(!parsed.success)throw new HttpError(400,'Check the status and notes.');const v=parsed.data;
 const row=await database().prepare('UPDATE inquiries SET status=?,notes=?,updated_at=?,version=version+1 WHERE id=? AND version=? RETURNING *').bind(v.status,v.notes,Date.now(),id,v.version).first();
 if(!row)throw new HttpError(409,'This inquiry changed in another session. Refresh the inbox before saving.');return json({inquiry:row});
 }catch(e){return fail(e)}}
