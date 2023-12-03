"use server";

import { nanoid } from "nanoid";
import { ZodError, z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma";
import sessionId from "@/helpers/sessionId";
import currentUser from "@/helpers/currentUser";
import ipRateLimit from "@/helpers/ipRateLimit";

const schema = z.object({
  url: z.string({ required_error: "Url is required." }).min(1),
  title: z.string(),
});

export default async function shorte(url: string, revalidate?: string) {
  return await ipRateLimit("shorten", async () => {
    const user = await currentUser();
    const session = user ? null : sessionId();

    try {
      const body = await (await fetch(url)).text();
      const title = body.match("<title>(.*?)</title>")?.[1] || "Untitled";

      await prisma.url.create({
        data: {
          ...schema.parse({ url, title }),
          id: nanoid(8),
          userId: user?.id,
          session,
        },
      });

      if (revalidate) {
        revalidatePath(revalidate);
      }
    } catch (e) {
      if (e instanceof ZodError) {
        return {
          errors: Object.fromEntries(
            e.errors.map((e) => [e.path.join("."), e.message])
          ),
        };
      } else {
        return {
          errors: {
            url: "Unable to shorten URL.",
          },
        };
      }
    }

    return {};
  });
}
