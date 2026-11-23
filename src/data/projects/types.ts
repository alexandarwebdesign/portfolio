import type { ImageMetadata } from 'astro';
import type { RouteId } from '../../i18n/routes';

export interface Note {
  title: string;
  problem: string;
  solution: string;
  why: string;
}

export type Figure =
  | {
      kind: 'notes';
      id: string;
      image: ImageMetadata;
      alt: string;
      points: [number, number][];
      notes: Note[];
      narrow?: boolean;
    }
  | { kind: 'gallery'; items: { image: ImageMetadata; alt: string }[]; narrow?: boolean }
  | {
      kind: 'video';
      /** Base path in /public/video, without the .av1.mp4 / .h264.mp4 suffix. */
      src: string;
      width: number;
      height: number;
      label: string;
      /** ISO 8601, for the VideoObject schema. */
      duration: string;
      narrow?: boolean;
    };

/** The fixed skeleton: context → problem → evidence → decisions → result. */
export interface Chapter {
  id: 'context' | 'problem' | 'evidence' | 'decisions' | 'result';
  label: string;
  title: string;
  text: string[];
  list?: string[];
  facts?: { term: string; desc: string }[];
  figures?: Figure[];
}

export interface CaseContent {
  meta: { title: string; description: string };
  name: string;
  status: string;
  lead: string;
  facts: { term: string; desc: string }[];
  hero: { image: ImageMetadata; alt: string };
  live: { href: string; label: string };
  chapters: Chapter[];
  next: { route: RouteId; name: string };
}
