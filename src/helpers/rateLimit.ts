import { LRUCache } from "lru-cache";

export default function rateLimit(
  ttl: number,
  limit: number,
  getKey: () => string,
  fn: Function
) {
  const tokenCache = new LRUCache({
    max: 500,
    ttl: ttl,
  });

  return function () {
    const key = getKey();
    let tokenCount = (tokenCache.get(key) as number) || 0;
    tokenCache.set(key, ++tokenCount);

    console.log(tokenCount);
    if (tokenCount >= limit) {
      throw new Error("Rate limited");
    }

    return fn.apply(null, arguments);
  };
}
