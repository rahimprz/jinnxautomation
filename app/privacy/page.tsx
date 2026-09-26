import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/privacy','Privacy Notice | Jinnx Automation','How Jinnx Automation stores and handles the information you send through our inquiry form.');
export default function Page(){return <Home initialRoute="privacy"/>}
