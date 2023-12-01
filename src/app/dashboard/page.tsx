import { redirect } from "next/navigation";
import currentUser from "@/helpers/currentUser";
import Pagination from "@/components/Pagination";
import UrlList from "../../components/UrlList";
import ShortenBar from "@/components/ShortenBar";
import { Box } from "@chakra-ui/react";
import prisma from "@/prisma";

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

  const urlCount = await prisma.url.count({ where: { userId: user.id } });
  const perPage = 10;
  const pages = Math.ceil(urlCount / perPage);

  const urls = await prisma.url.findMany({
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
      <Box mt={4}>
        <ShortenBar />
      </Box>
      <UrlList urls={urls} />
      <Pagination
        baseUrl="/dashboard"
        pages={pages}
        currentPage={currentPage}
      />
    </>
  );
}
