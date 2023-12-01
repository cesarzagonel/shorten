import { RedisClientType, createClient } from "redis";

let client: RedisClientType;

export default async function getRedis() {
  if (!client) {
    client = createClient();
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
  }

  return client;
}
