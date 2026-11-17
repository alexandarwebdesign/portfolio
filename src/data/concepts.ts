import type { ImageMetadata } from 'astro';
import concept01 from '../assets/images/concepts/concept-01.jpg';
import concept02 from '../assets/images/concepts/concept-02.jpg';
import concept03 from '../assets/images/concepts/concept-03.jpg';
import concept04 from '../assets/images/concepts/concept-04.jpg';
import concept05 from '../assets/images/concepts/concept-05.jpg';
import concept06 from '../assets/images/concepts/concept-06.jpg';
import concept07 from '../assets/images/concepts/concept-07.jpg';

/** Self-initiated website concepts: designs only, never presented as client work. */
export interface Concept {
  name: string;
  image: ImageMetadata;
  category: { bg: string; en: string };
}

export const concepts: Concept[] = [
  {
    name: 'Maren',
    image: concept01,
    category: { bg: 'Интериорно студио', en: 'Interior studio' },
  },
  {
    name: 'Throughline',
    image: concept06,
    category: { bg: 'SaaS · управление на проекти', en: 'SaaS · Project management' },
  },
  {
    name: 'Mara Vidal',
    image: concept04,
    category: { bg: 'Фотограф · портфолио', en: 'Photographer · Portfolio' },
  },
  {
    name: 'Helio',
    image: concept03,
    category: { bg: 'Онлайн магазин · аудио', en: 'E-commerce · Audio' },
  },
  {
    name: 'Aerwave',
    image: concept05,
    category: { bg: 'Електрически самолети', en: 'Electric aircraft' },
  },
  {
    name: 'Brae',
    image: concept07,
    category: { bg: 'Изпичане на кафе', en: 'Coffee roastery' },
  },
  {
    name: 'Axis',
    image: concept02,
    category: { bg: 'Инструмент за разработчици', en: 'Developer tool' },
  },
];

export const conceptsText = {
  bg: {
    label: 'Концепции',
    title: 'Идеи, проектирани без бриф.',
    note: 'Самостоятелни концепции за различни бизнеси, не клиентски проекти.',
    alt: (name: string) => `Начален екран на концепцията ${name}`,
  },
  en: {
    label: 'Concepts',
    title: 'Ideas designed without a brief.',
    note: 'Self-initiated concepts for different businesses, not client work.',
    alt: (name: string) => `Home screen of the ${name} concept`,
  },
};
