import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/security','Security & Data Handling | Jinnx Automation','How Jinnx Automation handles access, data, AI providers and approvals: your accounts, no training on your data, every action logged, nothing sent without a person.');
export default function Page(){return <Home initialRoute="security"/>}
