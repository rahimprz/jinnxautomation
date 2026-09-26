import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/process','How We Build AI Automations | Jinnx Automation','Our process for AI automation projects: discovery, a written scope, builds with review points, testing, launch, and support. Clear boundaries and human approval at every step.');
export default function Page(){return <Home initialRoute="process"/>}
