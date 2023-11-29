import { redirect } from "next/navigation";
import prisma from "../prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1")
    .split(",")
    .shift();

  const url = await prisma.url.findFirstOrThrow({
    where: { id },
  });

  await prisma.visit.create({
    data: {
      ip,
      urlId: url.id,
    },
  });

  redirect(url.url);
}
