import "core-js/actual/set-immediate";
import "./dbTestCase";
import "./cookies";

jest.mock(
  "../src/helpers/rateLimit",
  () => (expire: number, limit: number, key: string, fn: Function) => fn()
);

jest.mock(
  "../src/helpers/ipRateLimit",
  () => (key: string, fn: Function) => fn()
);
