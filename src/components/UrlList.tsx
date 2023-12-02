"use client";

import { inferAsyncReturnType } from "@/helpers/types";
import {
  CardHeader,
  CardBody,
  Heading,
  Box,
  Stack,
  Link as ChackraLink,
  Card,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import prisma from "@/prisma";

export default function UrlList({
  urls,
}: {
  urls: inferAsyncReturnType<
    typeof prisma.url.findMany<{
      include: { _count: { select: { visits: boolean } } };
    }>
  >;
}) {
  return (
    <Stack mt={4} mb={4} spacing={4} w={"100%"}>
      {urls.map((url) => (
        <Card key={url.id}>
          <CardHeader pb={0}>
            <Heading size="md" as={Link} href={`/details/${url.id}`}>
              {url.title}
            </Heading>
          </CardHeader>

          <CardBody pt={2} pb={2}>
            <ChackraLink
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/${url.id}`}
              display={"block"}
              color={"blue.600"}
              target="_blank"
            >
              {process.env.NEXT_PUBLIC_BASE_URL}/{url.id}
            </ChackraLink>

            <ChackraLink href={url.url} display={"block"} target="_blank">
              {url.url}
            </ChackraLink>

            <Box>Visits: {url._count.visits}</Box>

            <Text textAlign={"right"} fontSize={14} color={"gray.600"}>
              {url.createdAt.toLocaleDateString()} at{" "}
              {url.createdAt.toLocaleTimeString()}
            </Text>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}
