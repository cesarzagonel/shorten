import "@/test/actionTestCase";

import crypto from "crypto";
import { addMinutes } from "date-fns";
import { cookies } from "next/headers";
import prisma from "@/prisma";
import otpLogin from "./otpLogin";

jest.mock("next/headers");

it("should login using otp", async () => {
  const set = jest.fn();
  (cookies as jest.Mock).mockImplementation(() => ({
    get: jest.fn(),
    set: set,
  }));

  let user = await prisma.user.create({
    data: {
      email: "test@mail.com",
    },
  });

  const otp = await prisma.otp.create({
    data: {
      id: crypto.randomBytes(64).toString("hex"),
      otp: "123456",
      userId: user.id,
      expireAt: addMinutes(new Date(), 15),
    },
  });

  await otpLogin(otp.id, otp.otp);

  user = await prisma.user.findFirstOrThrow({ where: { id: user.id } });

  expect(set).toHaveBeenCalledWith("token", user.token, {
    expires: expect.any(Date),
    httpOnly: true,
    secure: true,
  });
});
