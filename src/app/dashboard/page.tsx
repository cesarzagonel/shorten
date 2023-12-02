import { redirect } from "next/navigation";
import currentUser from "@/helpers/currentUser";
import Pagination from "@/components/Pagination";
import UrlList from "../../components/UrlList";
import ShortenBar from "@/components/ShortenBar";
import { Card, CardBody } from "@chakra-ui/react";
import prisma from "@/prisma";
import Container from "@/components/Container";

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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Container darkBackground>
      <Card mt={4}>
        <CardBody>
          <ShortenBar />
        </CardBody>
      </Card>

      <UrlList urls={urls} />
      
      <Pagination
        baseUrl="/dashboard"
        pages={pages}
        currentPage={currentPage}
      />
    </Container>
  );
}
