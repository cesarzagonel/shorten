"use server";

import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import prisma from "../prisma";

export async function otpLogin(
  id: string,
  otp: string
): Promise<{ error: string } | {}> {
  const session = cookies().get("session")?.value;

  return await prisma.$transaction(async (tx) => {
    const otpObject = await tx.otp.findFirst({
      where: { id, otp },
    });

    if (!otpObject) {
      return { error: "Invalid OTP." };
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

    cookies().set("token", token);

    return {};
  });
}
