import { addonNames } from '@/lib/inquiries';

// Pushes each website inquiry into Twenty CRM (https://twenty.com) as a Person,
// an Opportunity at the NEW stage, and a Note holding the inquiry text.
// Configure with TWENTY_API_URL (e.g. https://api.twenty.com, or your
// self-hosted origin) and TWENTY_API_KEY (Settings → APIs & Webhooks in Twenty).
// The inquiry is already saved in Postgres, so a CRM failure is logged, not surfaced.

export type CrmInquiry={id:string;name:string;email:string;phone?:string|null;idea:string;addons:number[]};
type Rec=Record<string,unknown>;

export function twentyConfigured(){return Boolean(process.env.TWENTY_API_URL&&process.env.TWENTY_API_KEY)}

async function request(method:string,path:string,body?:Rec):Promise<Rec>{
 const base=String(process.env.TWENTY_API_URL).replace(/\/+$/,'');
 const res=await fetch(base+path,{method,headers:{Authorization:'Bearer '+process.env.TWENTY_API_KEY,Accept:'application/json',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000)});
 const text=await res.text();
 // Never echo the token; keep error bodies short.
 if(!res.ok)throw new Error(`Twenty ${method} ${path.split('?')[0]} failed: ${res.status} ${text.slice(0,200)}`);
 return text?JSON.parse(text):{};
}
const data=(json:Rec)=>(json.data??{}) as Rec;
const created=(json:Rec,op:string)=>(data(json)[op]??{}) as Rec;

export function splitName(full:string){
 const parts=full.trim().split(/\s+/);
 return {firstName:parts[0]||full.trim(),lastName:parts.slice(1).join(' ')};
}

async function findOrCreatePerson(v:CrmInquiry):Promise<string>{
 const found=await request('GET','/rest/people?filter=emails.primaryEmail[eq]:'+encodeURIComponent(v.email)+'&limit=1');
 const existing=(data(found).people as Rec[]|undefined)?.[0];
 if(existing?.id)return String(existing.id);
 const body:Rec={name:splitName(v.name),emails:{primaryEmail:v.email}};
 if(v.phone)body.phones={primaryPhoneNumber:v.phone};
 try{return String(created(await request('POST','/rest/people',body),'createPerson').id)}
 catch(e){
  // An unparseable phone number should never cost us the lead.
  if(!body.phones||!/phone/i.test((e as Error).message))throw e;
  delete body.phones;
  return String(created(await request('POST','/rest/people',body),'createPerson').id);
 }
}

export function noteMarkdown(v:CrmInquiry){
 const interests=v.addons.map(i=>addonNames[i]).filter(Boolean);
 return [
  `**Website inquiry** · reference \`${v.id}\``,
  `**Email:** ${v.email}`+(v.phone?`  \n**Phone:** ${v.phone}`:''),
  interests.length?`**Interested in:** ${interests.join(', ')}`:'',
  '---',
  v.idea,
 ].filter(Boolean).join('\n\n');
}

export async function pushInquiryToTwenty(v:CrmInquiry){
 if(!twentyConfigured())return {skipped:true as const};
 const personId=await findOrCreatePerson(v);
 const stage=process.env.TWENTY_OPPORTUNITY_STAGE||'NEW';
 const opportunityId=String(created(await request('POST','/rest/opportunities',{name:`${v.name} · website inquiry`,stage,pointOfContactId:personId}),'createOpportunity').id);
 const noteId=String(created(await request('POST','/rest/notes',{title:`Website inquiry from ${v.name}`,bodyV2:{markdown:noteMarkdown(v)}}),'createNote').id);
 await request('POST','/rest/noteTargets',{noteId,personId});
 await request('POST','/rest/noteTargets',{noteId,opportunityId});
 return {personId,opportunityId,noteId};
}

export async function syncInquiry(v:CrmInquiry){
 try{return await pushInquiryToTwenty(v)}
 catch(e){console.error('[twenty] inquiry '+v.id+' not synced:',(e as Error).message);return {error:(e as Error).message}}
}
