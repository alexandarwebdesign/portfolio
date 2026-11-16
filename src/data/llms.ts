import { site } from './site';
import { home, work } from './home';
import { services } from './services';
import { process } from './process';
import { faq } from './faq';
import { about } from './about';
import { uslugi } from './uslugi';
import { birse } from './projects/birse';
import { forma } from './projects/forma';
import { pathFor } from '../i18n/routes';
import type { CaseContent } from './projects/types';

// llms.txt (https://llmstxt.org) in English, generated from the same data as
// the pages, so it only ever links to pages that exist.

const url = (path: string) => new URL(path, site.url).href;
const en = home.en;

const intro = `# ${site.name.en}

> ${site.name.en} is a UX/UI designer and web developer based in Sofia, Bulgaria, working with clients worldwide. He applies UX psychology and precise UI craft entirely to websites. Not to be confused with other people named Aleksandar Pavlov – contact: ${site.email}.

The site is bilingual: Bulgarian is the default at ${url('/')}, English is under ${url('/en')}.`;

const caseLine = (route: 'birse' | 'forma', content: CaseContent) =>
  `- [${content.name}](${url(pathFor(route, 'en')!)}): ${content.status}. ${content.lead} Live: ${content.live.href}`;

const contact = `## Contact

- Email: ${site.email}
- Reply within 24 hours. Free consultation; the brief form is at ${url('/en#contact')}.
- Profiles: ${site.social.map((s) => `[${s.name}](${s.url})`).join(', ')}`;

const bulgarian = `## Bulgarian pages

- [Начало](${url('/')}), [За мен](${url('/about')}), [Birsé](${url('/birse')}), [FORMA Architects](${url('/forma-architects')}): Bulgarian versions of the English pages.
- [${uslugi.meta.title}](${url('/uslugi')}): A Bulgarian-only offer for local businesses. ${uslugi.prices.items.map((p) => `${p.title}: ${p.price}`).join('; ')}. ${uslugi.prices.note}`;

export function llms(): string {
  return `${intro}

## Services

${services.en.map((s) => `- [${s.title}](${url('/en#services')}): ${s.text}`).join('\n')}

## Work

${caseLine('birse', birse.en)}
${caseLine('forma', forma.en)}
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

const caseFull = (route: 'birse' | 'forma', content: CaseContent) => `### ${content.name}

URL: ${url(pathFor(route, 'en')!)}
Status: ${content.status}
${content.facts.map((f) => `${f.term}: ${f.desc}`).join('\n')}
Live: ${content.live.href}

${content.lead}

${content.chapters
  .map(
    (chapter) => `#### ${chapter.label}: ${chapter.title}

${chapter.text.join('\n\n')}${chapter.list ? '\n\n' + chapter.list.map((item) => `- ${item}`).join('\n') : ''}${
      chapter.facts ? '\n\n' + chapter.facts.map((f) => `- ${f.term}: ${f.desc}`).join('\n') : ''
    }${chapter.figures
      ?.flatMap((figure) => (figure.kind === 'notes' ? figure.notes : []))
      .map((note) => `\n- ${note.title}: ${note.problem} ${note.solution} ${note.why}`)
      .join('')}`,
  )
  .join('\n\n')}`;

export function llmsFull(): string {
  return `${intro}

## ${en.hero.title.join(' ')}

${en.hero.lead}

## Services

${services.en.map((s) => `### ${s.title}\n\n${s.text}`).join('\n\n')}

## Process

${process.en.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join('\n')}

## Work

${caseFull('birse', birse.en)}

${caseFull('forma', forma.en)}

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
