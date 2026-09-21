import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/server/auth';
import Inbox from './inbox';
export const dynamic='force-dynamic';
export default async function AdminPage(){
 if(!await hasSession())redirect('/admin/login');
 return <Inbox owner="Owner"/>;
}
