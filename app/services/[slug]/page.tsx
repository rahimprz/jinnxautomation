import Home from '@/app/page';
import { services } from '@/lib/site-content';
import { notFound } from 'next/navigation';
export function generateStaticParams(){return services.map(item=>({slug:item.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=services.find(i=>i.slug===slug);return {title:item?('name' in item?item.name:'')+' | Jinnx Automation':'Page not found'}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!services.some(s=>s.slug===slug))notFound();return <Home initialRoute={'services/'+slug}/>}
