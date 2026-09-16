// [MOCK-API] Cache simple con TTL para Angular (rendimiento)
const cache = new Map<string, { data: unknown; exp: number }>();
const TTL = 60_000;
export function getCache(key: string): unknown | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.exp) { cache.delete(key); return null; }
  return e.data;
}
export function setCache(key: string, data: unknown, ttl = TTL): void {
  cache.set(key, { data, exp: Date.now() + ttl });
}
export function clearMockCache(): void { cache.clear(); }
