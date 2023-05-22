
import React from "react";

import { Box, Flex, Text, Heading, Button, Input, FormLabel, FormControl, FormErrorMessage, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api, filterErrors, handleErrors, handleResponse, handleSuccess } from "~/lib/http";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotPasswordSchema = z.object({
  email: z.string()
    .nonempty("Email address must not be empty.")
    // .email("Email address should valid.")
});

const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ email }) => handleResponse(
      api.post("/auth/forgot-password", { email })
    )
  });
}

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });
  const forgotPasswordMutation = useForgotPasswordMutation();

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate(data);
  };

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
        <Heading>Forgot Password</Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex my={2} py={2} flexDirection={"column"} gap={2}>
           {forgotPasswordMutation.error &&
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle>Reset Failed!</AlertTitle>
                <AlertDescription>{forgotPasswordMutation.error.getError().message}</AlertDescription>
              </Alert>
            }
            {forgotPasswordMutation.isSuccess &&
              <Alert status='success'>
                <AlertIcon />
                <AlertTitle>Link Sent!</AlertTitle>
                <AlertDescription>{forgotPasswordMutation.data.itemByDomain("auth").message}</AlertDescription>
              </Alert>
            }
            {forgotPasswordMutation.isLoading &&
              <Alert status='loading'>
                <AlertIcon />
                <AlertTitle>Sending Reset Link...</AlertTitle>
              </Alert>
            }
            
            <FormControl isInvalid={errors.email} w="full">
              <FormLabel>Enter your email</FormLabel>
              <Input {...register("email")} type="text" w="full" />
              {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
            </FormControl>

            <Button type="submit">Send me a reset link</Button>

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
