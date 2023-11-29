"use client";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { signup } from "../actions";

export interface SignupForm {
  email: string;
  password: string;
}

export default function Signup() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignupForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupMutation = useMutation(signup);

  function onSubmit(data: SignupForm) {
    signupMutation.mutate(data);
  }

  return (
    <Box
      h={"100vh"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Card>
        <CardHeader>
          <Heading size="md">Signup</Heading>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: "E-mail is required",
                  })}
                />

                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", {
                    required: "E-mail is required",
                  })}
                />

                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              <Button type="submit">Signup</Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}
