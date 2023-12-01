import { headers } from "next/headers";
import rateLimit from "@/helpers/rateLimit";
import { MINUTE_S } from "./time";

const ipRateLimit = <T, A extends unknown[]>(
  key: string,
  fn: (...args: A) => T
) =>
  rateLimit(
    MINUTE_S,
    120,
    (..._args: A) =>
      key + "_" + headers().get("x-forwarded-for")?.split(",").shift() || "::1",
    fn
  );

export default ipRateLimit;
