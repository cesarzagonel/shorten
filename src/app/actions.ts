"use server";

import { nanoid } from "nanoid";
import { ZodError, z } from "zod";
import prisma from "./prisma";
import { cookies } from "next/headers";
import { SignupForm } from "./signup/page";
import bcrypt from "bcrypt";

export async function shorten(url: string) {
  const token = cookies().get("token");

  const user = await prisma.user.findFirstOrThrow({
    where: { token: token!.value },
  });

  const body = await (await fetch(url)).text();
  const title = body.match("<title>(.*?)</title>")?.[1] || "Untitled";

  try {
    const schema = z.object({
      url: z.string({ required_error: "Url is required." }).min(1),
      title: z.string(),
    });

    await prisma.url.create({
      data: {
        id: nanoid(8),
        ...schema.parse({ url, title }),
        userId: user.id,
      },
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return { errors: e.errors };
    }
  }
}

export async function signup(credentials: SignupForm) {
  const hashedPassword = await bcrypt.hash(credentials.password, 10);

  await prisma.user.create({
    data: {
      ...credentials,
      password: hashedPassword,
    },
  });
}

export async function login(credentials: { email: string; password: string }) {
  const user = await prisma.user.findFirst({
    where: {
      email: credentials.email,
    },
  });

  if (!user) {
    return { success: false };
  }

  const hashMatches = await bcrypt.compare(credentials.password, user.password);

  if (hashMatches) {
    const token = nanoid(64);

    await prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    cookies().set("token", token);
    return { success: true };
  }

  return { success: false };
}
