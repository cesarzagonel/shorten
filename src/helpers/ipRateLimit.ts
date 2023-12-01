import { headers } from "next/headers";
import rateLimit from "@/helpers/rateLimit";

export const ipRateLimit = (fn: Function) =>
  rateLimit(
    60_000,
    60,
    () => headers().get("x-forwarded-for")?.split(",").shift() || "::1",
    fn
  );
