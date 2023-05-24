import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { api, handleResponse } from "~/lib/http";
import { wait } from "~/lib/utils";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import TwoColsLayout from "~/ui/layouts/two-cols";

const signupSchema = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data => data.password === data.confirmPassword), {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

function useSignupMutation(options = {}) {
  return useMutation({
    mutationFn: (data) => handleResponse(
      api.post("/auth/register", data)
    ),
    ...options
  });
}

export default function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  })
  const signupMutation = useSignupMutation({
    onSuccess: () => {
      wait(2000)
        .then(() => navigate("/auth/login"));
    }
  });

  function onSubmit(data) {
    const signupData = {
      email: data.email,
      name: data.name,
      password: data.password,
      description: "",
    };

    signupMutation.mutate(signupData);
  }

  return <Box minHeight={"100vh"}>
    <Header>
      <HeadingLogo />
    </Header>

    <TwoColsLayout>
      <Box
        p={8}
        flex={1}
        px={{base: 8, md: 14}}
      >
        <Box>
          <Heading
            fontFamily={"Montserrat"}
            p={2}
            fontSize={42}
          >
            Create new account
          </Heading>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            p={2}
            flexDirection={"column"}
            gap={4}
          >
            {signupMutation.error &&
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle>Signup Failed!</AlertTitle>
                <AlertDescription>
                  {
                    signupMutation.error.getError()?.message ||
                    signupMutation.error.getRawValue()?.message
                  }
                </AlertDescription>
              </Alert>
            }
            {signupMutation.isSuccess &&
              <Alert status='success'>
                <AlertIcon />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  {
                    signupMutation.data.itemByDomain("auth")?.message
                  }
                </AlertDescription>
              </Alert>
            }
            {signupMutation.isLoading &&
              <Alert status='loading'>
                <AlertIcon />
                <AlertTitle>Logging in...</AlertTitle>
              </Alert>
            }

            <FormControl isInvalid={errors.email} flexDirection={"column"}>
              <FormLabel>E-mail</FormLabel>
              <Input {...register("email")} variant="filled" />
              {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={errors.name} flexDirection={"column"}>
              <FormLabel>Name</FormLabel>
              <Input {...register("name")} variant="filled" />
              {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
            </FormControl>
            
            <FormControl isInvalid={errors.password} flexDirection={"column"}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register("password")} variant="filled" />
              {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword} flexDirection={"column"}>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" {...register("confirmPassword")} variant="filled" />
              {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
            </FormControl>

            <Button type="submit" variant="solid">Sign Up</Button>
            
            <Text color={"gray.300"}>
              Already have an account? <Link
                to="/auth/login"
                style={{
                  textDecoration: "underline",
                  color: "#007aff"
                }}>Login!</Link>
            </Text>
          </Flex>
        </form>
      </Box>
      <Box
        flex={1}
        minHeight={"100%"}
      >
      </Box>
    </TwoColsLayout>
  </Box>
}
