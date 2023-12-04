import { cookies } from "next/headers";

jest.mock("next/headers");

beforeEach(() => {
  const jar = new Map<string, object>();

  const get = jest
    .fn()
    .mockImplementation((key: string) => ({ value: jar.get(key) }));

  const set = jest.fn().mockImplementation((key: string, value: object) => {
    jar.set(key, value);
    return this;
  });

  (cookies as jest.Mock).mockImplementation(() => ({
    get,
    set,
  }));
});
