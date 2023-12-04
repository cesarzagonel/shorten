import Container from "@/components/Container";
import HomeIllustration from "@/components/HomeIllustration";
import ShortenBar from "@/components/ShortenBar";
import UrlList from "@/components/UrlList";
import currentUser from "@/helpers/currentUser";
import sessionId from "@/helpers/sessionId";
import prisma from "@/prisma";
import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  const session = sessionId();
  const urls = await prisma.url.findMany({
    where: {
      session,
    },
    include: {
      _count: {
        select: { visits: true },
      },
    },
  });

  return (
    <Container>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          textAlign={"center"}
        >
          <Text as={"span"} color={"orange.400"}>
            Free
          </Text>{" "}
          short URLs with statistics
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"} textAlign={"center"}>
          Shorten and track with Shortim today! Experience the power of seamless
          sharing and in-depth analytics. Get started now! 🚀
        </Text>

        <ShortenBar />

        {urls && (
          <>
            <UrlList urls={urls} />
            <Button as={Link} href={"/signin"}>
              Login to see statistics
            </Button>
          </>
        )}

        <Flex w={"full"}>
          <HomeIllustration
            height={{ sm: "24rem", lg: "28rem" }}
            mt={{ base: 12, sm: 16 }}
          />
        </Flex>
      </Stack>
    </Container>
  );
}
