import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/automation-check','Free Automation Check: How Many Hours Could AI Save You? | Jinnx Automation','A free, two-minute automation check. Enter the hours your recurring work takes and see how much an AI agent could prepare for your approval, and where to start.');
export default function Page(){return <Home initialRoute="automation-check"/>}
