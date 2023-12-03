import { headers } from "next/headers";
import { MINUTE_S } from "./time";
import rateLimit from "@/helpers/rateLimit";

export default async function ipRateLimit<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  return await rateLimit(
    MINUTE_S,
    120,
    key + "-" + headers().get("x-forwarded-for")?.split(",").shift() || "::1",
    fn
  );
}
