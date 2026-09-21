'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function AdminLogin(){
 const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const router=useRouter();
 async function submit(event:React.FormEvent){
  event.preventDefault();setBusy(true);setError('');
  try{
   const res=await fetch('/api/admin/session',{method:'POST',headers:{'Content-Type':'application/json','X-Jinnx-Request':'1'},body:JSON.stringify({password})});
   const data=await res.json() as {error?:string};
   if(!res.ok)throw new Error(data.error||'Sign in failed.');
   router.replace('/admin');router.refresh();
  }catch(e){setError((e as Error).message);setBusy(false)}
 }
 return <main className="admin-access">
  <Link href="/">← Jinnx Automation</Link>
  <h1>Admin inbox</h1>
  <p>Enter the admin password to open the inquiry inbox.</p>
  <form onSubmit={submit}>
   <label htmlFor="admin-password">Password</label>
   <input id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/>
   <button className="button" type="submit" disabled={busy||!password}>{busy?'Signing in…':'Sign in'}</button>
  </form>
  {error?<p role="alert">{error}</p>:null}
 </main>;
}
