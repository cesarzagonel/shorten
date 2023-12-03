"use client";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import otpRequest from "@/server/otpRequest";
import Container from "@/components/Container";

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
    <Container darkBackground>
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
                <Text>Provide your best e-mail.</Text>

                <FormControl isInvalid={Boolean(mutation.error)}>
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "E-mail is required",
                    })}
                  />

                  {mutation.error instanceof Error ? (
                    <FormErrorMessage>
                      {mutation.error.message}
                    </FormErrorMessage>
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
    </Container>
  );
}
