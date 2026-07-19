/**
 * Static search index consumed by the nav search island.
 * Built from /data at build time; no runtime data access.
 */
import type { APIRoute } from 'astro';
import { searchIndex } from '../lib/data.ts';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(searchIndex()), {
    headers: { 'Content-Type': 'application/json' },
  });
