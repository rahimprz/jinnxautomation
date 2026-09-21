import { sql, lt } from 'drizzle-orm';
import { requestLimits } from '@/db/schema';
import { hasSession } from './auth';
import { database } from './db';
export class HttpError extends Error{constructor(public status:number,message:string){super(message)}}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}})}
export function fail(error:unknown){if(error instanceof HttpError)return json({error:error.message},error.status);console.error('Inquiry service error',error instanceof Error?error.name:'UnknownError');return json({error:'The inbox is temporarily unavailable. Please try again.'},503)}
// The deployment origin is not known at build time, so it is assembled from the
// environment. An empty allowlist rejects every mutation rather than opening up.
export function allowedOrigins(){
 const list=new Set<string>();
 for(const entry of (process.env.ALLOWED_ORIGINS||'').split(','))
  {const value=entry.trim();if(value)try{list.add(new URL(value).origin)}catch{}}
 if(process.env.NEXT_PUBLIC_SITE_URL)try{list.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin)}catch{}
 if(process.env.VERCEL_PROJECT_PRODUCTION_URL)list.add('https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL);
 if(process.env.VERCEL_URL)list.add('https://'+process.env.VERCEL_URL);
 if(process.env.NODE_ENV!=='production'){list.add('http://localhost:3000');list.add('http://127.0.0.1:3000')}
 return list;
}
export function guardMutation(req:Request){
 const origin=req.headers.get('origin');
 if(!origin||!allowedOrigins().has(origin)||req.headers.get('sec-fetch-site')==='cross-site')throw new HttpError(403,'This request is not allowed.');
 if(req.headers.get('x-jinnx-request')!=='1'||!req.headers.get('content-type')?.startsWith('application/json'))throw new HttpError(415,'Please use the website form.');
}
export async function readBody(req:Request){
 if(Number(req.headers.get('content-length')||0)>12000)throw new HttpError(413,'Your message is too long.');
 const reader=req.body?.getReader();if(!reader)throw new HttpError(400,'A request body is required.');let size=0;const chunks:Uint8Array[]=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>12000){await reader.cancel();throw new HttpError(413,'Your message is too long.')}chunks.push(value)}
 const out=new Uint8Array(size);let offset=0;for(const c of chunks){out.set(c,offset);offset+=c.length}try{return JSON.parse(new TextDecoder().decode(out))}catch{throw new HttpError(400,'Invalid request.')}
}
export async function requireAdmin(){
 if(!await hasSession())throw new HttpError(401,'Sign in to open the admin inbox.');
}
// Vercel terminates the connection, so the client address arrives in the
// forwarding headers rather than Cloudflare's `cf-connecting-ip`.
export function clientAddress(req:Request){
 const forwarded=req.headers.get('x-forwarded-for');
 return forwarded?.split(',')[0]?.trim()||req.headers.get('x-real-ip')||'';
}
export async function limitRequests(identity:string){
 const now=Date.now(),bucket=Math.floor(now/600000),digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identity+':'+bucket));
 const key=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
 const counts=await database().transaction(async tx=>{
  await tx.delete(requestLimits).where(lt(requestLimits.expiresAt,now));
  const bump=async(id:string)=>{
   const [row]=await tx.insert(requestLimits).values({key:id,count:1,expiresAt:now+1200000})
    .onConflictDoUpdate({target:requestLimits.key,set:{count:sql`${requestLimits.count} + 1`}})
    .returning({count:requestLimits.count});
   return row?.count??0;
  };
  return {perIdentity:await bump(key),overall:await bump('global:'+bucket)};
 });
 if(counts.perIdentity>5||counts.overall>100)throw new HttpError(429,'Too many submissions. Please wait 10 minutes and try again.');
}
