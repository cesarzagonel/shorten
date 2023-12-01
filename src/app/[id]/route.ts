import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import prisma from "../../prisma";
import geolocation from "@/services/geolocation";
import { ipRateLimit } from "@/helpers/ipRateLimit";

export const GET = ipRateLimit(
  async (
    request: NextRequest,
    { params: { id } }: { params: { id: string } }
  ) => {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",").shift() || "127.0.0.1";

    const url = await prisma.url.findFirstOrThrow({
      where: { id },
    });

    await geolocation(ip);

    await prisma.visit.create({
      data: {
        ip,
        urlId: url.id,
      },
    });

    redirect(url.url);
  }
);
