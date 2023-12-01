"use server";

import crypto from "crypto";
import { addMinutes } from "date-fns";
import { customAlphabet } from "nanoid";
import prisma from "../prisma";
import Mailer from "@/services/mailer";

export async function otpRequest(
  email: string
): Promise<{ error: string } | { id: string }> {
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
