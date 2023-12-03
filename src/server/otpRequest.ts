"use server";

import crypto from "crypto";
import { addMinutes } from "date-fns";
import { customAlphabet } from "nanoid";
import prisma from "@/prisma";
import Mailer from "@/services/mailer";
import ipRateLimit from "@/helpers/ipRateLimit";
import rateLimit from "@/helpers/rateLimit";
import { MINUTE_S } from "@/helpers/time";

export default async function otpRequest(email: string) {
  return await ipRateLimit(`otp-request`, async () => {
    return await rateLimit(
      MINUTE_S * 60,
      10,
      `otp-request-${email}`,
      async () => {
        return await prisma.$transaction(async (tx) => {
          const user = await tx.user.upsert({
            where: {
              email,
            },
            update: {
              email,
            },
            create: {
              email,
            },
          });

          const otp = await tx.otp.create({
            data: {
              id: crypto.randomBytes(64).toString("hex"),
              otp: customAlphabet("0123456789")(6),
              userId: user.id,
              expireAt: addMinutes(new Date(), 15),
            },
          });

          await Mailer.send(
            email,
            "OTP",
            `Here is your one time password: ${otp.otp}`
          );

          return { id: otp.id };
        });
      }
    );
  });
}
