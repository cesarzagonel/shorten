import prisma from "@/prisma";
import geolocation from "@/services/geolocation";

async function work() {
  console.log("Backgroud: ready to work 💪");

  while (true) {
    const visits = await prisma.visit.findMany({ where: { country: null } });

    for (const visit of visits) {
      const geo = await geolocation(visit.ip);

      await prisma.visit.update({
        where: { id: visit.id },
        data: { country: geo.country, region: geo.regionName, city: geo.city },
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

work();
