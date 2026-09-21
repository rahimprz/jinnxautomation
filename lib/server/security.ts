import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from './db';
export class HttpError extends Error{constructor(public status:number,message:string){super(message)}}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}})}
export function fail(error:unknown){if(error instanceof HttpError)return json({error:error.message},error.status);console.error('Inquiry service error',error instanceof Error?error.name:'UnknownError');return json({error:'The inbox is temporarily unavailable. Please try again.'},503)}
export function guardMutation(req:Request){
 const origin=req.headers.get('origin');const allowed=new Set(['https://jinnxautomation.hibestow001.chatgpt.site']);
 if(process.env.NODE_ENV!=='production')allowed.add('http://terminal.local:4173');
 if(!origin||!allowed.has(origin)||req.headers.get('sec-fetch-site')==='cross-site')throw new HttpError(403,'This request is not allowed.');
 if(req.headers.get('x-jinnx-request')!=='1'||!req.headers.get('content-type')?.startsWith('application/json'))throw new HttpError(415,'Please use the website form.');
}
export async function readBody(req:Request){
 if(Number(req.headers.get('content-length')||0)>12000)throw new HttpError(413,'Your message is too long.');
 const reader=req.body?.getReader();if(!reader)throw new HttpError(400,'A request body is required.');let size=0;const chunks:Uint8Array[]=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>12000){await reader.cancel();throw new HttpError(413,'Your message is too long.')}chunks.push(value)}
 const out=new Uint8Array(size);let offset=0;for(const c of chunks){out.set(c,offset);offset+=c.length}try{return JSON.parse(new TextDecoder().decode(out))}catch{throw new HttpError(400,'Invalid request.')}
}
export async function requireAdmin(){
 const user=await getChatGPTUser();if(!user)throw new HttpError(401,'Sign in to open the admin inbox.');
 const db=database();let owner=await db.prepare('SELECT user_id FROM admin_owner WHERE slot = 1').first<{user_id:string}>();
 // Bootstrap only from the verified platform identity of this Site’s existing owner.
 if(!owner&&user.email.toLowerCase()==='marketing@hibestow.com'){
  await db.prepare('INSERT OR IGNORE INTO admin_owner (slot,user_id,created_at) VALUES (1,?,?)').bind(user.userId,Date.now()).run();
  owner=await db.prepare('SELECT user_id FROM admin_owner WHERE slot = 1').first<{user_id:string}>();
 }
 if(!owner||owner.user_id!==user.userId)throw new HttpError(403,'This inbox is restricted to the site owner.');return user;
}
export async function limitRequests(identity:string){
 const now=Date.now(),bucket=Math.floor(now/600000),digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identity+':'+bucket));
 const key=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');const db=database();
 const records=await db.batch([
 db.prepare('DELETE FROM request_limits WHERE expires_at < ?').bind(now),
 db.prepare('INSERT INTO request_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+1200000),
 db.prepare('INSERT INTO request_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind('global:'+bucket,now+1200000)
 ]);
 const count=(records[1].results[0] as {count:number}).count,global=(records[2].results[0] as {count:number}).count;
 if(count>5||global>100)throw new HttpError(429,'Too many submissions. Please wait 10 minutes and try again.');
}
