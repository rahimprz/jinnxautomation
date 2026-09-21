import { z } from 'zod';
import { verifyPassword, startSession, endSession } from '@/lib/server/auth';
import { json,fail,guardMutation,readBody,limitRequests,clientAddress,HttpError } from '@/lib/server/security';
const credentials=z.object({password:z.string().min(1).max(200)}).strict();
export async function POST(req:Request){try{
 guardMutation(req);
 // Rate limit before checking, so the password cannot be guessed in bulk.
 await limitRequests('login:'+(clientAddress(req)||'unknown'));
 const parsed=credentials.safeParse(await readBody(req));
 if(!parsed.success)throw new HttpError(400,'Enter the admin password.');
 if(!await verifyPassword(parsed.data.password))throw new HttpError(401,'That password is not correct.');
 await startSession();
 return json({success:true});
 }catch(e){return fail(e)}}
export async function DELETE(req:Request){try{
 guardMutation(req);await endSession();return json({success:true});
 }catch(e){return fail(e)}}
