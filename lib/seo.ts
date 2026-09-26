import type { Metadata } from 'next';

// Production origin. Override with NEXT_PUBLIC_SITE_URL (no trailing slash) if the domain changes.
export const SITE_URL=(process.env.NEXT_PUBLIC_SITE_URL||'https://jinnxautomation.com').replace(/\/+$/,'');
export const SITE_NAME='Jinnx Automation';

// Search terms AI automation agencies rank for, matched to what this site actually offers.
export const keywords=[
 'AI automation agency','AI agency','AI automation services','AI agents for business','AI agent development',
 'custom AI agents','AI automation for small business','business process automation','workflow automation agency',
 'AI workflow automation','CRM automation','sales automation','AI lead generation','lead qualification AI',
 'AI email reply agent','email campaign automation','AI voice agents','AI receptionist','voice AI call automation',
 'invoice automation','payment reminder automation','custom software development','AI integration services',
 'n8n automation','Make.com automation','Zapier automation','human-in-the-loop AI','AI consulting',
 'AI automation agency Chicago','AI automation agency Glasgow','AI automation agency UK','AI automation agency USA',
];

export function pageMetadata(path:string,title:string,description:string):Metadata{
 const url=path==='/'?SITE_URL:SITE_URL+path;
 return {
  title,description,
  alternates:{canonical:url},
  openGraph:{type:'website',url,title,description,siteName:SITE_NAME,locale:'en_US',images:[{url:'/images/jinnx-automation-logo.png',alt:SITE_NAME}]},
  twitter:{card:'summary_large_image',title,description,images:['/images/jinnx-automation-logo.png']},
 };
}
