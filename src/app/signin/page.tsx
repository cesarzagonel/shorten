"use client";

import {
  Box,
  Button,
  Card,
  CardBody,
  CircularProgress,
  FormErrorMessage,
  Input,
  Stack,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { otpRequest } from "@/server/otpRequest";

interface LoginForm {
  email: string;
}

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();

  const mutation = useMutation(async (data: LoginForm) => {
    const result = await otpRequest(data.email);

    if ("id" in result) {
      router.push(`/signin/confirm?id=${result.id}`);
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
      <Card w={400}>
        <CardBody>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <Stack spacing={4}>
              <FormControl isInvalid={Boolean(mutation.error)}>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: "E-mail is required",
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
                disabled={mutation.isLoading}
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
