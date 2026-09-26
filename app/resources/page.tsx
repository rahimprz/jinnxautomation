import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/resources','AI Automation Guides & Resources | Jinnx Automation','Practical guides on what to automate first, human-in-the-loop AI, project briefs, tech stacks, and launching your first release.');
export default function Page(){return <Home initialRoute="resources"/>}
