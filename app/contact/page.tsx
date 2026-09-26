import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/contact','Contact an AI Automation Agency | Jinnx Automation','Tell us the recurring work you want automated. Jinnx Automation replies by email with a plan for AI agents, CRM automation, or custom software. Offices in Chicago and Glasgow.');
export default function Page(){return <Home initialRoute="contact"/>}
