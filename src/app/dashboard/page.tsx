import client from "../../prisma";
import { redirect } from "next/navigation";
import currentUser from "@/helpers/currentUser";
import Pagination from "@/components/Pagination";
import UrlList from "../../components/UrlList";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page || "1");

  const user = await currentUser();
  if (!user) {
    redirect("/signin");
  }

  const urlCount = await client.url.count({ where: { userId: user.id } });
  const perPage = 10;
  const pages = Math.ceil(urlCount / perPage);

  const urls = await client.url.findMany({
    where: { userId: user.id },
    take: perPage,
    skip: (currentPage - 1) * perPage,
    include: {
      _count: {
        select: { visits: true },
      },
    },
  });

  return (
    <>
      <UrlList urls={urls} />
      <Pagination baseUrl="/dashboard" pages={pages} currentPage={currentPage} />
    </>
  );
}
