
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

function useActivateAccountMutation(options = {}) {
  return useMutation({
    mutationFn: (data) => handleResponse(
      api.post("/auth/activate-account", data)
    ),
    ...options
  });
}

export default function ActivateAccount() {
  const navigate = useNavigate();
  const { code } = useParams();
  console.log("Reset code: ", code);

  const activateAccountMutation = useActivateAccountMutation({
    onSuccess: () => {
      wait(1000)
        .then(() => navigate("/auth/login"));
    },
  });

  React.useEffect(() => {
    activateAccountMutation.mutate({
      code,
    })
  }, []);

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
        <Heading>Account Activation</Heading>

        <Flex my={2} py={2} flexDirection={"column"} gap={2}>
          {activateAccountMutation.error &&
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>Activation Failed!</AlertTitle>
              <AlertDescription>
                {
                  activateAccountMutation.error.getError()?.message ||
                  activateAccountMutation.error.getRawValue()?.message
                }
              </AlertDescription>
            </Alert>
          }
          {activateAccountMutation.isSuccess &&
            <Alert status='success'>
              <AlertIcon />
              <AlertTitle>Account Activated!</AlertTitle>
              <AlertDescription>{activateAccountMutation.data.itemByDomain("auth")?.message}</AlertDescription>
            </Alert>
          }
          {activateAccountMutation.isLoading &&
            <Alert status='loading'>
              <AlertIcon />
              <AlertTitle>Activating your account...</AlertTitle>
            </Alert>
          }
        </Flex>
      </Box>
    </Flex>
  </Box>
}
