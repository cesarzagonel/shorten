"use client";

import {
  Button,
  CircularProgress,
  Input,
  InputGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
} from "@chakra-ui/react";

import { useState } from "react";
import { useMutation } from "react-query";
import { usePathname } from "next/navigation";
import { shorten } from "@/server/shorten";

export default function ShortenBar({ showLabel }: { showLabel?: boolean }) {
  const pathname = usePathname();
  const [url, setUrl] = useState("");
  const shortenMutation = useMutation((url: string) => shorten(url, pathname));

  return (
    <FormControl isInvalid={Boolean(shortenMutation.data?.errors?.url)}>
      {showLabel && <FormLabel>URL:</FormLabel>}

      <HStack>
        <InputGroup size="md">
          <Input
            type="text"
            pr="4.5rem"
            placeholder="http://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </InputGroup>

        <Button
          disabled={shortenMutation.isLoading}
          onClick={async () => {
            await shortenMutation.mutateAsync(url);
            setUrl("");
          }}
        >
          {shortenMutation.isLoading ? (
            <CircularProgress size={18} isIndeterminate />
          ) : (
            "Create"
          )}
        </Button>
      </HStack>

      {shortenMutation.data?.errors?.url && (
        <FormErrorMessage>{shortenMutation.data?.errors?.url}</FormErrorMessage>
      )}
    </FormControl>
  );
}
