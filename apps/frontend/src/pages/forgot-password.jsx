
import React from "react";

import { Box, Flex, Text, Heading, Button, Input, FormLabel, FormControl } from "@chakra-ui/react";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api, filterErrors, handleErrors, handleSuccess } from "~/lib/http";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotPasswordSchema = z.object({
  email: z.string()
    .nonempty("Email address must not be empty.")
    // .email("Email address should valid.")
});

const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ email }) => {
      return api.post("/auth/forgot-password", { email })
        .then(res => res.data)
        .then(handleSuccess("auth"))
        .catch(handleErrors("auth"))
    }
  });
}

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = (data) => {
    
  };

  return <Box>
    <Header>
      <HeadingLogo />
    </Header>

    <Flex
      my={6}
      w="full"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box maxW={96} w="full">
        <Heading>Forgot Password</Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex my={2} py={2} flexDirection={"column"} gap={2}>
            <FormControl w="full">
              <FormLabel>Enter your email</FormLabel>
              <Input {...register("email")} type="text" w="full" />
            </FormControl>

            <Button>Send me a reset link</Button>

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
