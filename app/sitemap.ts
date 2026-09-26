import type { MetadataRoute } from 'next';
import { services, guides } from '@/lib/site-content';
import { SITE_URL } from '@/lib/seo';

// Bump when page content changes so search engines re-crawl.
const UPDATED=new Date('2026-09-26');

type Entry=MetadataRoute.Sitemap[number];
const page=(path:string,priority:number,changeFrequency:Entry['changeFrequency']):Entry=>({url:SITE_URL+path,lastModified:UPDATED,changeFrequency,priority});

export default function sitemap():MetadataRoute.Sitemap{
 return [
  {...page('',1,'weekly'),images:[SITE_URL+'/images/jinnx-automation-logo.png',SITE_URL+'/images/automation-sculpture.webp']},
  page('/services',0.9,'weekly'),
  ...services.map(s=>page('/services/'+s.slug,0.9,'monthly')),
  page('/work',0.8,'monthly'),
  page('/process',0.7,'monthly'),
  page('/plan',0.7,'monthly'),
  page('/about',0.7,'monthly'),
  page('/contact',0.8,'yearly'),
  page('/faq',0.6,'monthly'),
  page('/resources',0.7,'weekly'),
  ...guides.map(g=>page('/resources/'+g.slug,0.6,'monthly')),
  page('/privacy',0.2,'yearly'),
  page('/terms',0.2,'yearly'),
 ];
}
