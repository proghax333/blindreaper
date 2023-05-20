import { Box, Button, Flex, FormLabel, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import TwoColsLayout from "~/ui/layouts/two-cols";

export default function SignUp() {
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

        <form>
          <Flex
            p={2}
            flexDirection={"column"}
            gap={4}
          >
            <InputGroup flexDirection={"column"}>
              <FormLabel>E-mail</FormLabel>
              <Input variant="filled" />
            </InputGroup>

            <InputGroup flexDirection={"column"}>
              <FormLabel>Name</FormLabel>
              <Input variant="filled" />
            </InputGroup>
            
            <InputGroup flexDirection={"column"}>
              <FormLabel>Password</FormLabel>
              <Input variant="filled" />
            </InputGroup>


            <InputGroup flexDirection={"column"}>
              <FormLabel>Confirm Password</FormLabel>
              <Input variant="filled" />
            </InputGroup>

            <Button variant="solid">Sign Up</Button>
            
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
