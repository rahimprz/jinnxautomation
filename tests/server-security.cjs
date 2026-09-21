const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const {DatabaseSync}=require('node:sqlite');
const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_simple_rocket_racer.sql','utf8'));
let user=null;
const db={prepare(query){let args=[];const api={bind(...v){args=v;return api},async first(){return sql.prepare(query).get(...args)||null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){const r=sql.prepare(query).run(...args);return {meta:{changes:Number(r.changes)},results:[]}}};return api},async batch(list){const out=[];sql.exec('BEGIN');try{for(const s of list)out.push(await s.all());sql.exec('COMMIT');return out}catch(e){sql.exec('ROLLBACK');throw e}}};
const loaded={};function load(path){if(loaded[path])return loaded[path];const mod={exports:{}};const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const req=name=>name==='@/app/chatgpt-auth'?{getChatGPTUser:async()=>user}:name==='./db'||name==='@/lib/server/db'?{database:()=>db}:name==='@/lib/inquiries'?load('lib/inquiries.ts'):name==='@/lib/server/security'?load('lib/server/security.ts'):require(name);vm.runInNewContext(code,{exports:mod.exports,module:mod,require:req,process:{env:{NODE_ENV:'production'}},Response,Request,URL,URLSearchParams,TextEncoder,TextDecoder,Uint8Array,crypto:require('node:crypto').webcrypto,console,Date,Set});return loaded[path]=mod.exports}
const intake=load('app/api/inquiries/route.ts'),admin=load('app/api/admin/inquiries/route.ts'),edit=load('app/api/admin/inquiries/[id]/route.ts'),core=load('lib/inquiries.ts');
const origin='https://jinnxautomation.hibestow001.chatgpt.site';
function request(data,originValue=origin){return new Request(origin+'/api/inquiries',{method:'POST',headers:{origin:originValue,'Content-Type':'application/json','X-Jinnx-Request':'1'},body:JSON.stringify(data)})}
const data={id:crypto.randomUUID(),name:'Test Founder',email:'test@example.com',idea:'Build a CRM automation workflow for our customer inquiries.',addons:[0,3],consent:true,website:''};
(async()=>{
 assert.equal((await admin.GET(new Request(origin+'/api/admin/inquiries'))).status,401);
 user={userId:'outsider',email:'other@example.com'};assert.equal((await admin.GET(new Request(origin+'/api/admin/inquiries'))).status,403);
 assert.equal((await intake.POST(request(data,'https://attacker.example'))).status,403);
 assert.equal((await intake.POST(request({...data,addons:[99]}))).status,400);
 assert.equal((await intake.POST(request({...data,estimate:1}))).status,400);
 assert.equal((await intake.POST(request({...data,consent:false}))).status,400);
 assert.equal((await intake.POST(request({...data,idea:'x'.repeat(13000)}))).status,413);
 assert.equal((await intake.POST(request(data))).status,201);
 assert.equal((await intake.POST(request(data))).status,201);
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM inquiries').get().n,1);
 assert.equal(sql.prepare('SELECT estimate FROM inquiries').get().estimate,12299);
 user={userId:'owner-stable-id',email:'marketing@hibestow.com',displayName:'Owner'};
 assert.equal((await admin.GET(new Request(origin+'/api/admin/inquiries'))).status,200);
 user={userId:'different-id',email:'marketing@hibestow.com'};assert.equal((await admin.GET(new Request(origin+'/api/admin/inquiries'))).status,403);
 user={userId:'owner-stable-id',email:'renamed@example.com'};
 const update={status:'contacted',notes:'Follow up tomorrow',version:1};
 assert.equal((await edit.PATCH(request(update),{params:Promise.resolve({id:data.id})})).status,200);
 assert.equal((await edit.PATCH(request(update),{params:Promise.resolve({id:data.id})})).status,409);
 assert.equal(sql.prepare('SELECT notes FROM inquiries').get().notes,'Follow up tomorrow');
 const csv=await admin.GET(new Request(origin+'/api/admin/inquiries?export=csv'));assert.equal(csv.status,200);assert.match(await csv.text(),/Test Founder/);
 assert.equal(core.csvCell('=1+1'),'"\'=1+1"');
 const filters=await admin.GET(new Request(origin+'/api/admin/inquiries?q='+encodeURIComponent("' OR 1=1 --")));assert.equal((await filters.json()).total,0);
 for(let i=0;i<3;i++)assert.equal((await intake.POST(request({...data,id:crypto.randomUUID()}))).status,201);
 assert.equal((await intake.POST(request({...data,id:crypto.randomUUID()}))).status,429);
 console.log('PASS: access denial, stable owner binding, CSRF, validation, body limit, server pricing, idempotency, status/notes, conflict protection, SQL parameterization, CSV safety, rate limits.');
})().catch(e=>{console.error(e);process.exitCode=1});
