"use client";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { otpLogin } from "@/server/otpLogin";

interface ConfirmForm {
  otp: string;
}

export default function ConfirmForm({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ConfirmForm>();

  const mutation = useMutation(async (data: ConfirmForm) => {
    const result = await otpLogin(id, data.otp);

    if ("error" in result === false) {
      router.push("/");
    }

    return result;
  });

  return (
    <Box
      flexGrow={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Card maxW={500} flexGrow={1}>
        <CardHeader>
          <Heading size="md">Sign In / Sign Up</Heading>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <Stack spacing={4}>
              <Text>
                We sent a six digit code to <strong>{email}</strong>, enter the
                code on the field below:
              </Text>

              <FormControl isInvalid={Boolean(mutation.error)}>
                <FormLabel>Code</FormLabel>
                <Input
                  type="number"
                  {...register("otp", {
                    required: true,
                  })}
                />

                {mutation.error instanceof Error ? (
                  <FormErrorMessage>{mutation.error.message}</FormErrorMessage>
                ) : (
                  <></>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                rightIcon={
                  mutation.isLoading ? (
                    <CircularProgress
                      size={4}
                      isIndeterminate
                      color="orange.400"
                    />
                  ) : undefined
                }
              >
                Continue
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}
