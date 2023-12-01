import { RedisClientType, createClient } from "redis";

let client: RedisClientType;

export default async function getRedis() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: process.env.REDIS_TLS == "true",
      },
    });
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
  }

  return client;
}
