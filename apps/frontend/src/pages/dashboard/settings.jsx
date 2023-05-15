
import React from "react";
import { Box, Flex, Text, Heading, Button, Input, InputGroup, Textarea } from "@chakra-ui/react";
import { CheckCircle } from "@emotion-icons/material";

export default function Settings() {
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
      
      <Flex
        flexDirection="column"
        gap={4}
      >
        {/* General Settings */}
        <Flex flexDirection={"column"} gap={2}>
          <Heading fontSize="2xl">General Settings</Heading>

          <Box>
            <Text variant="input-label">Name</Text>
            <Input type="text" />
          </Box>

          <Box>
            <Text variant="input-label">Description</Text>
            <Input type="text" />
          </Box>
        </Flex>

        {/* Security */}
        <Flex flexDirection={"column"} py={2} gap={2}>
          <Heading fontSize="2xl">Security</Heading>
          
          <Box>
            <Text variant="input-label">Private Key</Text>
            <Textarea noOfLines={16} overflowY={"auto"}>
            </Textarea>
          </Box>
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
    </Flex>

  </Flex>
}
