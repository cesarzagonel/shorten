import getRedis from "@/redis";

export default function rateLimit<T, A extends unknown[]>(
  expire: number,
  limit: number,
  getKey: (...args: A) => string,
  fn: (...args: A) => T,
  message: string = "Too many requests. Please try again later."
): (...args: A) => Promise<T> {
  return async function (...args) {
    const redis = await getRedis();
    const key = getKey.apply(null, args);
    const count = await redis.incr(key);

    if (count == 1) {
      redis.expire(key, expire);
    }

    if (count > limit) {
      throw new Error(message);
    }

    return await fn.apply(null, args);
  };
}
