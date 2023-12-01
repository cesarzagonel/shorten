import prisma from "@/prisma";

export default class VisitRepository {
  static async visitsByCountryForUrl(urlId: string) {
    const result: { count: BigInt; country: string }[] =
      await prisma.$queryRaw`select count(*) as count, country from "Visit" where "urlId" = ${urlId} group by country order by count desc limit 10`;

    return result.map((row) => ({
      key: row.country,
      value: Number(row.count),
    }));
  }

  static async visitsByDayForUrl(urlId: string) {
    return (await prisma.$queryRaw`select count(id) as visits, 
        to_char("createdAt", 'YYYY-MM-DD') as "date"
        from "Visit"
        where "urlId" = ${urlId}
        group by "date"`) as {
      date: string;
      visits: bigint;
    }[];
  }
}
