import Urls from "./urls";
import client from "./prisma";
import { redirect } from "next/navigation";
import currentUser from "@/helpers/currentUser";

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  const urls = await client.url.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: { visits: true },
      },
    },
  });

  return <Urls urls={urls} />;
}
