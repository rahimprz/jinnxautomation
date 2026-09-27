import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/industries','AI Automation by Industry | Jinnx Automation','AI agents and automation for healthcare, real estate, legal, e-commerce, marketing agencies, SaaS, finance and more, each with a human approval step built in.');
export default function Page(){return <Home initialRoute="industries"/>}
