import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import prisma from "../../prisma";
import ipRateLimit from "@/helpers/ipRateLimit";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  return await ipRateLimit("url-redirect", async () => {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",").shift() || "::1";

    const url = await prisma.url.findFirstOrThrow({
      where: { id },
    });

    const visit = await prisma.visit.create({
      data: {
        ip,
        urlId: url.id,
      },
    });

    if (ip !== "::1") {
      await prisma.job.create({
        data: { task: "visit_geolocation", payload: { ip, visit: visit.id } },
      });
    }

    redirect(url.url);
  });
}
