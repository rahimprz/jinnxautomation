import Home from '@/app/page';
import { industries } from '@/lib/growth-content';
import { pageMetadata } from '@/lib/seo';
import { JsonLd, serviceSchema } from '@/lib/structured-data';
import { notFound } from 'next/navigation';
export function generateStaticParams(){return industries.map(item=>({slug:item.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=industries.find(i=>i.slug===slug);if(!item)return {title:'Page not found'};return pageMetadata('/industries/'+slug,'AI Automation for '+item.name+' | Jinnx Automation',item.intro)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!industries.some(s=>s.slug===slug))notFound();const item=industries.find(s=>s.slug===slug)!;return <><JsonLd data={serviceSchema('AI automation for '+item.name,item.intro,'/industries/'+slug)}/><Home initialRoute={'industries/'+slug}/></>}
