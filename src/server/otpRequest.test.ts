import "@/test/actionTestCase";

import otpRequest from "./otpRequest";
import Mailer from "@/services/mailer";
import prisma from "@/prisma";

jest.mock("../services/mailer");

it("should request otp", async () => {
  const email = "test@mail.com";
  await otpRequest(email);

  const user = await prisma.user.findFirstOrThrow({
    where: { email: email },
  });
  const otp = await prisma.otp.findFirstOrThrow({ where: { userId: user.id } });

  expect(Mailer.send).toHaveBeenCalledWith(
    email,
    "OTP",
    `Here is your one time password: ${otp.otp}`
  );
});
