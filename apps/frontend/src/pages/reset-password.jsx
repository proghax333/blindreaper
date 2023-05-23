
import React from "react";

import { Box, Flex, Text, Heading, Button, Input, FormControl, FormLabel, FormErrorMessage, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api, handleResponse } from "~/lib/http";
import { wait } from "~/lib/utils";


const resetPasswordSchema = z
  .object({
    email: z.string().nonempty("Email cannot be empty."),
    password: z.string().nonempty("Password cannot be empty."),
    confirmPassword: z.string().nonempty("Confirm password cannot be empty."),
  })
  .refine((data => data.password === data.confirmPassword), {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

function useResetPasswordMutation(options = {}) {
  return useMutation({
    mutationFn: (data) => handleResponse(
      api.post("/auth/reset-password", data)
    ),
    ...options
  });
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });
  const { code } = useParams();
  console.log("Reset code: ", code);

  const resetPasswordMutation = useResetPasswordMutation({
    onSuccess: () => {
      wait(1000)
        .then(() => navigate("/auth/login"));
    },
  });

  function onSubmit(formData) {
    const data = {
      code,
      email: formData.email,
      password: formData.password,
    };

    resetPasswordMutation.mutate(data);
  }

  return <Box>
    <Header>
      <HeadingLogo />
    </Header>

    <Flex
      my={6}
      p={2}
      w="full"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box maxW={"32rem"} w="full">
        <Heading>Reset Password</Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex my={2} py={2} flexDirection={"column"} gap={2}>
            {resetPasswordMutation.error &&
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle>Reset Failed!</AlertTitle>
                <AlertDescription>
                  {
                    resetPasswordMutation.error.getError()?.message ||
                    resetPasswordMutation.error.getRawValue()?.message
                  }
                </AlertDescription>
              </Alert>
            }
            {resetPasswordMutation.isSuccess &&
              <Alert status='success'>
                <AlertIcon />
                <AlertTitle>Password Reset!</AlertTitle>
                <AlertDescription>{resetPasswordMutation.data.itemByDomain("auth")?.message}</AlertDescription>
              </Alert>
            }
            {resetPasswordMutation.isLoading &&
              <Alert status='loading'>
                <AlertIcon />
                <AlertTitle>Resetting the password...</AlertTitle>
              </Alert>
            }
            
            <FormControl w="full" isInvalid={errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input {...register("email")} type="text" w="full" />
              {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
            </FormControl>

            <FormControl w="full" isInvalid={errors.password}>
              <FormLabel>New Password</FormLabel>
              <Input {...register("password")} type="password" w="full" />
              {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
            </FormControl>

            <FormControl w="full" isInvalid={errors.confirmPassword}>
              <FormLabel>Confirm New Password</FormLabel>
              <Input {...register("confirmPassword")} type="password" w="full" />
              {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
            </FormControl>

            <Button type="submit">Reset</Button>

            <Text>
              <Link
                to={"/auth/login"}
                style={{
                  textDecoration: "underline",
                  color: "#007aff"
                }}
              >Go to login page</Link>
            </Text>
          </Flex>
        </form>
      </Box>
    </Flex>
  </Box>
}
