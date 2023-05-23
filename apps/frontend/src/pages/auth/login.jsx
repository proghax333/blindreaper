import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import TwoColsLayout from "~/ui/layouts/two-cols";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api, filterErrors, filterItems, handleErrors, handleResponse, handleSuccess } from "~/lib/http";
import { wait } from "~/lib/utils";
import { useAuth } from "~/modules/auth/auth.context";

const loginSchema = z.object({
  login: z.string().nonempty("Login must not be empty."),
  password: z.string().nonempty("Password must not be empty."),
});

function useLoginMutation(options = {}) {
  const mutation = useMutation({
    mutationFn: ({ login, password }) => handleResponse(
      api.post("/auth/login", {
        login,
        password
      })
    )
    , ...options,
  });

  return mutation;
}

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const { reload } = useAuth();
  const loginMutation = useLoginMutation({
    onSuccess: () => {
      reload()
        .then(() => navigate("/dashboard/payloads"));
    }
  });

  async function onSubmit(data) {
    loginMutation.mutate(data);
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
            Sign into your account
          </Heading>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            p={2}
            flexDirection={"column"}
            gap={4}
          >
            {loginMutation.error &&
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle>Login Failed!</AlertTitle>
                <AlertDescription>
                  {
                    loginMutation.error.getError()?.message ||
                    loginMutation.error.getRawValue()?.message
                  }
                </AlertDescription>
              </Alert>
            }
            {loginMutation.isSuccess &&
              <Alert status='success'>
                <AlertIcon />
                <AlertTitle>Login Successful!</AlertTitle>
                <AlertDescription>
                  {
                    loginMutation.data.itemByDomain("auth")?.message
                  }
                </AlertDescription>
              </Alert>
            }
            {loginMutation.isLoading &&
              <Alert status='loading'>
                <AlertIcon />
                <AlertTitle>Logging in...</AlertTitle>
              </Alert>
            }

            <FormControl isInvalid={errors.login}>
              <FormLabel>Username</FormLabel>
              <Input {...register("login")} variant="filled" />
              {errors.login && <FormErrorMessage>{errors.login.message}</FormErrorMessage>}
            </FormControl>
            
            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <Input {...register("password")} type="password" variant="filled" />
              {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
            </FormControl>

            <Button type="submit" variant="solid">Sign In</Button>
            
            <Text>
              <Link
                to={"/forgot-password"}
                style={{
                  textDecoration: "underline",
                  color: "#007aff"
                }}
              >Forgot Password?</Link>
            </Text>

            <Text color={"gray.300"}>
              Don't have an account? <Link
                to="/auth/signup"
                style={{
                  textDecoration: "underline",
                  color: "#007aff"
                }}>Subscribe!</Link>
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
