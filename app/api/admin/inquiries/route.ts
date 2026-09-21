import { database } from '@/lib/server/db';
import { json,fail,requireAdmin,HttpError } from '@/lib/server/security';
import { statuses, csvCell } from '@/lib/inquiries';
import type { Inquiry } from '@/lib/inquiries';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{
 await requireAdmin();const url=new URL(req.url),search=(url.searchParams.get('q')||'').slice(0,120),status=url.searchParams.get('status')||'all';
 if(status!=='all'&&!statuses.includes(status as typeof statuses[number]))throw new HttpError(400,'Invalid filter.');
 const page=Math.max(0,Math.min(10000,Number(url.searchParams.get('page'))||0)),exportCsv=url.searchParams.get('export')==='csv';
 const clauses:string[]=[],args:(string|number)[]=[];if(status!=='all'){clauses.push('status = ?');args.push(status)}if(search){clauses.push('(name LIKE ? OR email LIKE ? OR idea LIKE ?)');args.push(...Array(3).fill('%'+search+'%'))}
 const where=clauses.length?' WHERE '+clauses.join(' AND '):'',db=database();
 const list=await db.prepare('SELECT * FROM inquiries'+where+' ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(...args,exportCsv?5000:30,exportCsv?0:Math.floor(page)*30).all<Inquiry>();
 if(exportCsv){const rows=[['Name','Email','Project','Estimate USD','Status','Notes','Received UTC'],...list.results.map(r=>[r.name,r.email,r.idea,r.estimate,r.status,r.notes,new Date(r.created_at).toISOString()])];return new Response('\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="Jinnx-Automation-inquiries.csv"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
 const count=await db.prepare('SELECT COUNT(*) as count FROM inquiries'+where).bind(...args).first<{count:number}>();
 const stats=await db.prepare('SELECT status, COUNT(*) as count FROM inquiries GROUP BY status').all<{status:string;count:number}>();
 return json({inquiries:list.results,total:count?.count||0,stats:stats.results,page:Math.floor(page)});
 }catch(e){return fail(e)}}
