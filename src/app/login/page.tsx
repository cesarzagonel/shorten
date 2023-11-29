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
import { login } from "../actions";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const loginMutation = useMutation(async (data: LoginForm) => {
    const result = await login(data);

    if (result.success) {
      console.log("redirect");
      router.push("/");
    }

    return result;
  });

  async function onSubmit(data: LoginForm) {
    loginMutation.mutate(data);
  }

  const isInvalid = loginMutation.data && !loginMutation.data?.success;

  return (
    <Box
      flexGrow={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Card w={400}>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={isInvalid}>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: "E-mail is required",
                  })}
                />
              </FormControl>

              <FormControl isInvalid={isInvalid}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                <FormErrorMessage>
                  E-mail or password does not match.
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                disabled={loginMutation.isLoading}
                rightIcon={
                  loginMutation.isLoading ? (
                    <CircularProgress
                      size={4}
                      isIndeterminate
                      color="orange.400"
                    />
                  ) : undefined
                }
              >
                Login
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}
