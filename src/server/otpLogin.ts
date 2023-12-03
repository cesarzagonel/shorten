"use server";

import { nanoid } from "nanoid";
import { addDays } from "date-fns";
import { cookies } from "next/headers";
import prisma from "@/prisma";
import { MINUTE_S } from "@/helpers/time";
import rateLimit from "@/helpers/rateLimit";
import ipRateLimit from "@/helpers/ipRateLimit";

export default async function otpLogin(id: string, otp: string) {
  return await ipRateLimit("otp-login", async () => {
    return await rateLimit(MINUTE_S * 15, 15, `otp-login-${id}`, async () => {
      const session = cookies().get("session")?.value;

      return await prisma.$transaction(async (tx) => {
        const otpObject = await tx.otp.findFirst({
          where: { id, otp },
        });

        if (!otpObject) {
          throw new Error("Invalid OTP.");
        }

        const token = nanoid(64);
        await tx.user.update({
          where: {
            id: otpObject.userId,
          },
          data: {
            token,
          },
        });

        if (session) {
          await tx.url.updateMany({
            where: {
              session,
            },
            data: {
              userId: otpObject.userId,
              session: null,
            },
          });
        }

        await tx.otp.delete({
          where: { id },
        });

        cookies().set("token", token, {
          secure: true,
          httpOnly: true,
          expires: addDays(new Date(), 30),
        });

        return {};
      });
    });
  });
}
