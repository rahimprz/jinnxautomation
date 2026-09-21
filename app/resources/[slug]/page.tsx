import Home from '@/app/page';
import { guides } from '@/lib/site-content';
import { notFound } from 'next/navigation';
export function generateStaticParams(){return guides.map(item=>({slug:item.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=guides.find(i=>i.slug===slug);return {title:item?('title' in item?item.title:'')+' | Jinnx Automation':'Page not found'}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!guides.some(s=>s.slug===slug))notFound();return <Home initialRoute={'resources/'+slug}/>}
