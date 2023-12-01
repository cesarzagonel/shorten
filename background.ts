import dotenv from "dotenv";
import prisma from "@/prisma";
import geolocation from "@/services/geolocation";

dotenv.config({ path: ".env.local" });

async function work() {
  console.log("Backgroud: ready to work 💪");

  while (true) {
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

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

work();
