
import React from "react";

import { Box, Flex, Text, Heading, Button, Input } from "@chakra-ui/react";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
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

        <Flex my={2} py={2} flexDirection={"column"} gap={2}>
          <Box w="full">
            <Text>Enter your username/email</Text>
            <Input type="text" w="full" />
          </Box>

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
      </Box>
    </Flex>
  </Box>
}
