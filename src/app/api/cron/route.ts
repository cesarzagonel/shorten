import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import geolocation from "@/services/geolocation";

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const jobs = await prisma.job.findMany({ where: { tries: { lt: 3 } } });
  for (const job of jobs) {
    if (job.task == "visit_geolocation") {
      try {
        const { ip, visit } = job.payload as { ip: string; visit: number };
        const geo = await geolocation(ip);

        await prisma.visit.update({
          where: { id: visit },
          data: {
            country: geo.country,
            region: geo.regionName,
            city: geo.city,
          },
        });

        await prisma.job.delete({ where: { id: job.id } });
      } catch (e) {
        console.error(e);

        await prisma.job.update({
          where: { id: job.id },
          data: { tries: { increment: 1 } },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
