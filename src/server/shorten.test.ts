import "core-js/actual/set-immediate";
import { shorten } from "./shorten";
import sessionId from "@/helpers/sessionId";
import currentUser from "@/helpers/currentUser";
import { inferAsyncReturnType } from "@/helpers/types";
import prisma from "@/prisma";

jest.mock("../helpers/rateLimit", () =>
  jest.fn().mockImplementation((expire, limit, getKey, fn) => {
    return fn;
  })
);

jest.mock("../helpers/currentUser");
jest.mock("../helpers/sessionId");

global.fetch = jest.fn();

beforeEach(async () => {
  await prisma.$transaction([
    prisma.url.deleteMany(),
    prisma.otp.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

describe("valid url", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      text: jest.fn().mockReturnValue("<title>Hey there!</title>"),
    });
  });

  describe("authenticated", () => {
    let user: inferAsyncReturnType<typeof prisma.user.create>;

    beforeEach(async () => {
      user = await prisma.user.create({
        data: {
          email: "user@mail.com",
        },
      });

      (currentUser as jest.Mock).mockResolvedValue(user);
    });

    it("should shorten", async () => {
      await shorten("http://localhost");

      expect(await prisma.url.findFirst()).toMatchObject({
        title: "Hey there!",
        url: "http://localhost",
        userId: user.id,
      });
    });
  });

  describe("annonymous", () => {
    beforeEach(() => {
      (sessionId as jest.Mock).mockReturnValue("session-id");
    });

    it("should shorten", async () => {
      await shorten("http://localhost");

      expect(await prisma.url.findFirst()).toMatchObject({
        title: "Hey there!",
        url: "http://localhost",
        session: "session-id",
      });
    });
  });
});

describe("invalid url", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockRejectedValue(new Error("HTTP error."));
  });

  it("should handle error", async () => {
    const result = await shorten("http://localhost");

    expect(result).toMatchObject({
      errors: { url: "Unable to shorten URL." },
    });
  });
});
