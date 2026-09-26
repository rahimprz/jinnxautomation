import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/terms','Terms of Service | Jinnx Automation','Terms for using the Jinnx Automation website: inquiries and estimates, AI output, third-party services, intellectual property, liability, and governing law.');
export default function Page(){return <Home initialRoute="terms"/>}
