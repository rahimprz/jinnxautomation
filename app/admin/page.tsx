import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { requireAdmin, HttpError } from '@/lib/server/security';
import Inbox from './inbox';
export const dynamic='force-dynamic';
export default async function AdminPage(){await requireChatGPTUser('/admin');try{const user=await requireAdmin();return <Inbox owner={user.displayName}/>;}catch(error){return <main className="admin-access"><a href="/">← Jinnx Automation</a><h1>{error instanceof HttpError&&error.status===403?'Owner access only':'Inbox temporarily unavailable'}</h1><p>{error instanceof HttpError?error.message:'Please refresh in a moment. No inquiry data has been loaded.'}</p><a className="button outline" href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top">Sign in with the owner account</a></main>}}
