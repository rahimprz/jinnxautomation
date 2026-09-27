import Home from '@/app/page';
import { services } from '@/lib/site-content';
import { pageMetadata } from '@/lib/seo';
import { JsonLd, serviceSchema } from '@/lib/structured-data';
import { notFound } from 'next/navigation';
export function generateStaticParams(){return services.map(item=>({slug:item.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=services.find(i=>i.slug===slug);if(!item)return {title:'Page not found'};return pageMetadata('/services/'+slug,item.name+' | AI Automation Agency | Jinnx Automation',item.intro)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!services.some(s=>s.slug===slug))notFound();const item=services.find(s=>s.slug===slug)!;return <><JsonLd data={serviceSchema(item.name,item.intro,'/services/'+slug)}/><Home initialRoute={'services/'+slug}/></>}
