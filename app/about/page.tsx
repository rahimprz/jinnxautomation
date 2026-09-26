import Home from '@/app/page';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('/about','About Jinnx Automation | AI Automation Agency in Chicago & Glasgow','Meet Jinnx Automation, an AI automation agency serving owner-run businesses in the US and UK. We build AI agents, workflow automation, and custom software with human approval built in.');
export default function Page(){return <Home initialRoute="about"/>}
