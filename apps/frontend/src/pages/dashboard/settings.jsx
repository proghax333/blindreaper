
import React from "react";
import { Box, Flex, Text, Heading, Button, Input, InputGroup, Textarea, FormLabel, FormControl, useToast } from "@chakra-ui/react";
import { CheckCircle } from "@emotion-icons/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api, handleResponse } from "~/lib/http";
import { useAuth } from "~/modules/auth/auth.context";

const updateAccountSchema = z.object({
  name: z.string(),
  description: z.string(),
  publicKey: z.string(),
  privateKey: z.string(),
});

function useAccountUpdateMutation(options) {
  return useMutation({
    mutationFn: ({ name, description, publicKey, privateKey }) => {
      return handleResponse(
        api.put("/account/update-details", {
          name,
          description,
          key: publicKey,
        })
      );
    },
    ...options,
  });
}

export default function Settings() {
  const toast = useToast();
  const { user, reload } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      "name": user.name,
      "description": user.description,
    }
  });
  const accountUpdateMutation = useAccountUpdateMutation({
    onSuccess: (data) => {
      reload();
      toast({
        title: 'Success!',
        description: data.itemByDomain("account").message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed!',
        description:
          error.errorByDomain("account")?.message ||
          error.getError()?.message ||
          error.getRawValue()?.message
        ,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  });

  function onSubmit(data) {
    accountUpdateMutation.mutate(data);
  }

  return <Flex
    w="full"
    h="full"
    flexDirection={"column"}
  >
    <Flex
      w="full"
      h="full"
      flexDirection="column"
      p={6}
      px={8}
      gap={4}
      overflowY={"auto"}
    >
      <Heading fontSize={36}>Settings</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          flexDirection="column"
          gap={4}
        >
          {/* General Settings */}
          <Flex flexDirection={"column"} gap={2}>
            <Heading fontSize="2xl">General Settings</Heading>

            <FormControl>
              <FormLabel variant="input-label">Name</FormLabel>
              <Input {...register("name")} type="text" />
            </FormControl>

            <FormControl>
              <FormLabel variant="input-label">Description</FormLabel>
              <Input {...register("description")} type="text" />
            </FormControl>
          </Flex>

          {/* Security */}
          <Flex flexDirection={"column"} py={2} gap={4}>
            <Heading fontSize="2xl">Security</Heading>
            
            <FormControl>
              <FormLabel variant="input-label">Public Key</FormLabel>
              <Textarea {...register("publicKey")} noOfLines={16} overflowY={"auto"}>
              </Textarea>
            </FormControl>

            <FormControl>
              <FormLabel variant="input-label">Private Key</FormLabel>
              <Textarea {...register("privateKey")} noOfLines={16} overflowY={"auto"}>
              </Textarea>
            </FormControl>
          </Flex>

          <Flex>
            <Button
              background={"#cc2222"}
              _hover={{
                background: "#bb2222"
              }}
              textColor={"#ddd"}
              px={8}
              fontSize="sm"
              fontFamily={"Montserrat"}
            >
              Change Password
            </Button>
          </Flex>

          <Flex>
            <Button
              type="submit"
              background={"green.600"}
              _hover={{
                background: "green.700"
              }}
              textColor={"white"}
              px={4}
              fontSize="sm"
              fontFamily={"Montserrat"}
            >
              <CheckCircle size={"16"} style={{margin: "0 0.4rem 0 0"}} />
              Submit
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>

  </Flex>
}
