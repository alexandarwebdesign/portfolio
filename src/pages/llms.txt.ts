import type { APIRoute } from 'astro';
import { llms } from '../data/llms';

export const GET: APIRoute = () => new Response(llms());
