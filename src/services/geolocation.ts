import { HOUR_S } from "@/helpers/time";
import getRedis from "@/redis";

export default async function geolocation(address: string): Promise<{
  country: string;
  regionName: string;
  city: string;
}> {
  const key = `geo_${address}`;
  const redis = await getRedis();
  const cache = await redis.get(key);

  if (!cache) {
    const data = await (
      await fetch(`http://ip-api.com/json/${address}`)
    ).json();

    if (data.status !== "success") {
      throw new Error(data);
    }

    await redis.set(key, JSON.stringify(data));
    await redis.expire(key, HOUR_S);

    return data;
  }

  return JSON.parse(cache!);
}
