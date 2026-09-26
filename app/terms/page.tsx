import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/terms','Terms | Jinnx Automation','Terms for using the Jinnx Automation website and submitting a project inquiry.');
export default function Page(){return <Home initialRoute="terms"/>}
