
import React from "react";

import { Box, Flex, Text, Heading, Button, Input } from "@chakra-ui/react";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import { Link } from "react-router-dom";

export default function ResetPassword() {
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

        <Flex my={2} py={2} flexDirection={"column"} gap={2}>
          <Box w="full">
            <Text>Email address</Text>
            <Input type="text" w="full" />
          </Box>

          <Box w="full">
            <Text>New Password</Text>
            <Input type="text" w="full" />
          </Box>

          <Box w="full">
            <Text>Confirm New Password</Text>
            <Input type="text" w="full" />
          </Box>

          <Button>Reset</Button>

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
