"use client";

import {
  Button,
  CircularProgress,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Box,
  Stack,
  Link as ChackraLink,
} from "@chakra-ui/react";

import { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { shorten } from "./actions";
import Link from "next/link";

export default function Urls({
  urls,
}: {
  urls: {
    id: string;
    title: string;
    url: string;
    _count: { visits: number };
  }[];
}) {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const shortenMutation = useMutation(shorten);

  return (
    <Container pt={4}>
      <FormControl
        isInvalid={Boolean(
          shortenMutation.data?.errors?.find((e) => e.path.join(".") == "url")
        )}
      >
        <FormLabel>URL:</FormLabel>

        <InputGroup size="md">
          <Input
            type="text"
            pr="4.5rem"
            placeholder="http://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={async () => {
                await shortenMutation.mutateAsync(url);
                router.refresh();
              }}
            >
              {shortenMutation.isLoading ? (
                <CircularProgress size={18} isIndeterminate />
              ) : (
                "Go!"
              )}
            </Button>
          </InputRightElement>
        </InputGroup>

        {shortenMutation.data?.errors?.map((error, i) => (
          <FormErrorMessage key={i}>{error.message}</FormErrorMessage>
        ))}
      </FormControl>

      <Stack mt={4} spacing={4}>
        {urls.map((url) => (
          <Card key={url.id}>
            <CardHeader pb={0}>
              <Heading size="md" as={Link} href={`/details/${url.id}`}>
                {url.title}
              </Heading>
            </CardHeader>

            <CardBody pt={2}>
              <ChackraLink
                href={`http://localhost:3000/${url.id}`}
                display={"block"}
                color={"blue.600"}
                target="_blank"
              >
                http://localhost:3000/{url.id}
              </ChackraLink>

              <ChackraLink href={url.url} display={"block"} target="_blank">
                {url.url}
              </ChackraLink>

              <Box>Visits: {url._count.visits}</Box>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
