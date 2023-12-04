import "@/test/serverTestCase";

import crypto from "crypto";
import { addMinutes } from "date-fns";
import prisma from "@/prisma";
import otpLogin from "./otpLogin";
import { cookies } from "next/headers";

jest.mock("next/headers");

it("should login using otp", async () => {
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

  expect(cookies().set).toHaveBeenCalledWith("token", user.token, {
    expires: expect.any(Date),
    httpOnly: true,
    secure: true,
  });
});
