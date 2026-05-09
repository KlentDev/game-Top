/* ── RAWG Video Games Database API ─────────────────────────────
   Docs: https://rawg.io/apidocs
   Free: 20,000 requests/month (non-commercial)
   ──────────────────────────────────────────────────────────── */

export const RAWG_KEY = (import.meta.env.VITE_RAWG_API_KEY as string | undefined) ?? '';
const BASE = 'https://api.rawg.io/api';

/* ── Types ──────────────────────────────────────────────────── */
export interface RawgGame {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  rating: number;
  ratings_count: number;
  metacritic: number | null;
  released: string | null;
  genres: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  short_screenshots: { id: number; image: string }[];
  platforms: { platform: { id: number; name: string } }[] | null;
}

export interface RawgResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
}

/* ── Helpers ─────────────────────────────────────────────────── */
function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('key', RAWG_KEY);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

/* ── API calls ───────────────────────────────────────────────── */

/** Fetch paginated list of popular games */
export function fetchPopularGames(page = 1, pageSize = 12): Promise<RawgResponse> {
  return apiFetch(buildUrl('/games', {
    page,
    page_size: pageSize,
    ordering: '-rating',
    metacritic: '60,100',
  }));
}

/** Full-text search */
export function searchRawgGames(
  query: string,
  page = 1,
  pageSize = 12,
): Promise<RawgResponse> {
  return apiFetch(buildUrl('/games', {
    search: query,
    page,
    page_size: pageSize,
    search_precise: 1,
  }));
}

/** Find the best RAWG match for a single local game name */
export async function enrichGame(name: string): Promise<RawgGame | null> {
  try {
    const result = await apiFetch<RawgResponse>(
      buildUrl('/games', { search: name, page_size: 1, search_precise: 1 }),
    );
    return result.results[0] ?? null;
  } catch {
    return null;
  }
}

/** Fetch games by genre slug (e.g. "action", "role-playing-games-rpg") */
export function fetchByGenre(
  genre: string,
  page = 1,
  pageSize = 12,
): Promise<RawgResponse> {
  return apiFetch(buildUrl('/games', { genres: genre, page, page_size: pageSize, ordering: '-rating' }));
}

/** Check if API key is configured */
export const hasRawgKey = () => Boolean(RAWG_KEY);
