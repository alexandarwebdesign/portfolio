import type { APIRoute } from 'astro';
import { llmsFull } from '../data/llms';

export const GET: APIRoute = () => new Response(llmsFull());
