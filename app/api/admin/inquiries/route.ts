import { and, or, eq, ilike, desc, count } from 'drizzle-orm';
import { database, inquiryColumns } from '@/lib/server/db';
import { inquiries } from '@/db/schema';
import { json,fail,requireAdmin,HttpError } from '@/lib/server/security';
import { statuses, csvCell } from '@/lib/inquiries';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{
 await requireAdmin();const url=new URL(req.url),search=(url.searchParams.get('q')||'').slice(0,120),status=url.searchParams.get('status')||'all';
 if(status!=='all'&&!statuses.includes(status as typeof statuses[number]))throw new HttpError(400,'Invalid filter.');
 const page=Math.max(0,Math.min(10000,Number(url.searchParams.get('page'))||0)),exportCsv=url.searchParams.get('export')==='csv';
 const filters=[];
 if(status!=='all')filters.push(eq(inquiries.status,status));
 // SQLite matched case-insensitively by default; ILIKE keeps that behaviour on
 // Postgres, where LIKE is case-sensitive.
 if(search){const pattern='%'+search+'%';filters.push(or(ilike(inquiries.name,pattern),ilike(inquiries.email,pattern),ilike(inquiries.idea,pattern)))}
 const where=filters.length?and(...filters):undefined,db=database();
 const rows=await db.select(inquiryColumns).from(inquiries).where(where).orderBy(desc(inquiries.createdAt)).limit(exportCsv?5000:30).offset(exportCsv?0:Math.floor(page)*30);
 if(exportCsv){const list=[['Name','Email','Phone','Project','Interests','Status','Notes','Received UTC'],...rows.map(r=>[r.name,r.email,r.phone||'',r.idea,r.addons,r.status,r.notes,new Date(r.created_at).toISOString()])];return new Response('﻿'+list.map(r=>r.map(csvCell).join(',')).join('\r\n'),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="Jinnx-Automation-inquiries.csv"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
 const [total]=await db.select({count:count()}).from(inquiries).where(where);
 const stats=await db.select({status:inquiries.status,count:count()}).from(inquiries).groupBy(inquiries.status);
 return json({inquiries:rows,total:Number(total?.count||0),stats:stats.map(s=>({status:s.status,count:Number(s.count)})),page:Math.floor(page)});
 }catch(e){return fail(e)}}
