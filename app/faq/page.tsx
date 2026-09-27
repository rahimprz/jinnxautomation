import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
import { JsonLd, faqSchema } from '@/lib/structured-data';
export const metadata=pageMetadata('/faq','AI Automation Agency FAQ | Jinnx Automation','Answers about AI automation projects: pricing, timelines, human approval, data access, the tools we integrate, and what happens after launch.');
export default function Page(){return <><JsonLd data={faqSchema()}/><Home initialRoute="faq"/></>}
