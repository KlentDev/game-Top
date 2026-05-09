import { useEffect, useRef, useState } from 'react';
import { enrichGame, hasRawgKey, type RawgGame } from '../services/rawg';
import { games as localGames } from '../data/games';

export type EnrichmentMap = Record<string, RawgGame | null>;

let cachedMap: EnrichmentMap | null = null;
let cachePromise: Promise<EnrichmentMap> | null = null;

/** Fetch RAWG enrichment data for all local games (cached in module scope) */
function loadEnrichment(): Promise<EnrichmentMap> {
  if (cachedMap) return Promise.resolve(cachedMap);
  if (cachePromise) return cachePromise;

  cachePromise = Promise.all(
    localGames.map(async (g) => {
      const rawg = await enrichGame(g.name);
      return [g.id, rawg] as [string, RawgGame | null];
    }),
  ).then((entries) => {
    cachedMap = Object.fromEntries(entries);
    return cachedMap;
  });

  return cachePromise;
}

interface UseRawgEnrichmentResult {
  enrichment: EnrichmentMap;
  loading: boolean;
  /** Returns the best available image for a local game ID */
  coverOf: (gameId: string, localFallback: string) => string;
  /** Returns RAWG rating (0-5) or null */
  ratingOf: (gameId: string) => number | null;
}

export function useRawgEnrichment(): UseRawgEnrichmentResult {
  const [enrichment, setEnrichment] = useState<EnrichmentMap>({});
  const [loading, setLoading] = useState(hasRawgKey());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!hasRawgKey()) return;

    loadEnrichment().then((map) => {
      if (mounted.current) {
        setEnrichment(map);
        setLoading(false);
      }
    });

    return () => { mounted.current = false; };
  }, []);

  const coverOf = (gameId: string, localFallback: string): string =>
    enrichment[gameId]?.background_image ?? localFallback;

  const ratingOf = (gameId: string): number | null =>
    enrichment[gameId]?.rating ?? null;

  return { enrichment, loading, coverOf, ratingOf };
}
