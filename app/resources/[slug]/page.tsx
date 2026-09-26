import Home from '@/app/page';
import { guides } from '@/lib/site-content';
import { pageMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
export function generateStaticParams(){return guides.map(item=>({slug:item.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=guides.find(i=>i.slug===slug);if(!item)return {title:'Page not found'};return pageMetadata('/resources/'+slug,item.title+' | Jinnx Automation',item.summary)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!guides.some(s=>s.slug===slug))notFound();return <Home initialRoute={'resources/'+slug}/>}
