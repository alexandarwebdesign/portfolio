import { site } from './site';
import { home, work } from './home';
import { services } from './services';
import { process } from './process';
import { faq } from './faq';
import { about } from './about';
import { birse } from './projects/birse';
import { forma } from './projects/forma';
import { tunora } from './projects/tunora';
import { birseCopy, formaCopy, tunoraCopy } from './case-copy';
import { pathFor } from '../i18n/routes';
import type { CaseContent } from './projects/types';

// llms.txt (https://llmstxt.org) in English, generated from the same data as
// the pages, so it only ever links to pages that exist.

const url = (path: string) => new URL(path, site.url).href;
const en = home.en;

const intro = `# ${site.name.en}

> ${site.name.en} is a UX/UI designer and web developer based in Sofia, Bulgaria, working with clients worldwide. He applies UX psychology and precise UI craft entirely to websites. Not to be confused with other people named Aleksandar Pavlov – contact: ${site.email}.

The site is bilingual: Bulgarian is the default at ${url('/')}, English is under ${url('/en')}.`;

const caseLine = (route: 'birse' | 'forma' | 'tunora', content: CaseContent) =>
  `- [${content.name}](${url(pathFor(route, 'en')!)}): ${content.status}. ${content.lead} Live: ${content.live.href}`;

const contact = `## Contact

- Email: ${site.email}
- Reply within 24 hours. Free consultation; the brief form is at ${url('/en#contact')}.
- Profiles: ${site.social.map((s) => `[${s.name}](${s.url})`).join(', ')}`;

const bulgarian = `## Bulgarian pages

- [Начало](${url('/')}), [За мен](${url('/about')}), [Birsé](${url('/birse')}), [FORMA Architects](${url('/forma-architects')}), [Tunora](${url('/tunora')}): Bulgarian versions of the English pages.`;

export function llms(): string {
  return `${intro}

## Services

${services.en.map((s) => `- [${s.title}](${url('/en#services')}): ${s.text}`).join('\n')}

## Work

${caseLine('birse', birse.en)}
${caseLine('forma', forma.en)}
${caseLine('tunora', tunora.en)}
${work
  .filter((item) => item.status)
  .map((item) => `- ${item.name} (${item.category.en}): ${item.status!.en}, not yet published.`)
  .join('\n')}

## About

- [About](${url('/en/about')}): ${about.en.lead}
- Process: ${process.en.map((s) => s.title).join(' → ')}.

${bulgarian}

${contact}
`;
}

const plain = (html: string) =>
  html
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

type Block = {
  kicker?: string;
  title?: string;
  text?: string;
  phones?: Block[];
  items?: string[][];
};

// The case study text comes from the same copy the pages render.
const caseSections = (copy: Record<string, unknown>) =>
  Object.values(copy)
    .filter((v): v is Block => typeof v === 'object' && v !== null && !Array.isArray(v))
    .filter((v) => v.title && (v.text || v.items))
    .map((block) => {
      const lines = [`#### ${block.kicker}: ${block.title}`];
      if (block.text) lines.push('', plain(block.text));
      const list = [
        ...(block.phones ?? []).map((phone) => `- ${phone.title}: ${plain(phone.text ?? '')}`),
        ...(block.items ?? []).map(([role, text]) => `- ${role}: ${text}`),
      ];
      if (list.length) lines.push('', ...list);
      return lines.join('\n');
    })
    .join('\n\n');

const caseFull = (
  route: 'birse' | 'forma' | 'tunora',
  content: CaseContent,
  copy: { meta: { label: string; items: string[] }[] } & Record<string, unknown>,
) => `### ${content.name}

URL: ${url(pathFor(route, 'en')!)}
Status: ${plain(String(copy.badge))}
${copy.meta.map((m) => `${plain(m.label)}: ${m.items.map(plain).join('; ')}`).join('\n')}
Live: ${content.live.href}

${content.lead}

${caseSections(copy)}`;

export function llmsFull(): string {
  return `${intro}

## ${en.hero.title}

${en.hero.lead}

## Services

${services.en.map((s) => `### ${s.title}\n\n${s.text}`).join('\n\n')}

## Process

${process.en.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join('\n')}

## Work

${caseFull('birse', birse.en, birseCopy.en)}

${caseFull('forma', forma.en, formaCopy.en)}

${caseFull('tunora', tunora.en, tunoraCopy.en)}

## About

${about.en.lead}

${about.en.text.join('\n\n')}

${about.en.facts.map((f) => `- ${f.term}: ${f.desc}`).join('\n')}

## FAQ

${faq.en.map((item) => `**${item.q}**\n${item.a}`).join('\n\n')}

${bulgarian}

${contact}
`;
}
