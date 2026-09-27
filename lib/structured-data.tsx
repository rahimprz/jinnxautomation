import templates from '@/lib/reference-templates.json';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

type Tree = string | { tag: string; props: Record<string, unknown>; children: Tree[] };
const text = (n: Tree): string => typeof n === 'string' ? n : n.children.map(text).join('');
const nodes = function* (n: Tree): Generator<Exclude<Tree, string>> { if (typeof n === 'string') return; yield n; for (const c of n.children) yield* nodes(c); };

// The FAQ answers exactly as the page renders them, for FAQPage rich results.
export function faqItems() {
  const out: { q: string; a: string }[] = [];
  for (const n of nodes((templates.home as unknown as Tree[])[11])) {
    if (n.props['data-component'] !== 'faq') continue;
    const q = n.children.find(c => typeof c !== 'string' && c.props.className === 'faq-q');
    const a = n.children.find(c => typeof c !== 'string' && c.props.className === 'faq-a');
    if (q && a) out.push({ q: text(q).trim(), a: text(a).trim() });
  }
  return out;
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export const faqSchema = () => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems().map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

export const serviceSchema = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org', '@type': 'Service', name, description, url: SITE_URL + path,
  serviceType: name, areaServed: ['US', 'GB'], provider: { '@id': SITE_URL + '/#organization', name: SITE_NAME },
});
