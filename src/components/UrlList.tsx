"use client";

import {
  CardHeader,
  CardBody,
  Heading,
  Box,
  Stack,
  Link as ChackraLink,
  Card,
} from "@chakra-ui/react";
import Link from "next/link";

export default function UrlList({
  urls,
}: {
  urls: {
    id: string;
    title: string;
    url: string;
    _count: { visits: number };
  }[];
}) {
  return (
    <Stack mt={4} spacing={4} w={'100%'}>
      {urls.map((url) => (
        <Card key={url.id}>
          <CardHeader pb={0}>
            <Heading size="md" as={Link} href={`/details/${url.id}`}>
              {url.title}
            </Heading>
          </CardHeader>

          <CardBody pt={2}>
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
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}
