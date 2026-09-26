import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/privacy','Privacy Policy | Jinnx Automation','How Jinnx Automation collects, uses, and protects personal information, including inquiries, client project data, AI processing, and your GDPR and CCPA rights.');
export default function Page(){return <Home initialRoute="privacy"/>}
