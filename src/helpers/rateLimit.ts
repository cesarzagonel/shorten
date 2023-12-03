import getRedis from "@/redis";

export default async function rateLimit<T>(
  expire: number,
  limit: number,
  key: string,
  fn: () => T,
  message: string = "Too many requests. Please try again later."
): Promise<T> {
  const redis = await getRedis();
  const count = await redis.incr(key);

  if (count == 1) {
    redis.expire(key, expire);
  }

  if (count > limit) {
    throw new Error(message);
  }

  return fn();
}
