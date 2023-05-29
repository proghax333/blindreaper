import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import DefaultHomeNavigation from "~/ui/DefaultHomeNavigation";

function StylishLink({ children, to = "/" }) {
  return <Button
    as={Link}
    to={to}

    borderRadius={"0"}
    w={32}
    h={12}
    background={"#1d1d1d"}
  >
    {children}
  </Button>
}

export default function Index() {
  return <div>
    <DefaultHomeNavigation />

    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      px={4}
    >
      <Box
        maxW={"48rem"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Heading
          textAlign={"center"}
          fontSize={52}
          fontWeight={"extrabold"}
          p={8}
          pt={24}
          fontFamily="Montserrat"
        >
          Reaping the souls out of Blind XSS vulnerable websites.
        </Heading>
        <Text
          textColor={"gray.300"}
        >
          A tool for capturing blind XSS attacks, with opt-in end-to-end encryption.
        </Text>

        <Flex gap={4} py={4}>
          <StylishLink to="/auth/signup">Subscribe</StylishLink>
          <StylishLink to="/auth/login">Login</StylishLink>
        </Flex>
      </Box>
    </Box>
  </div>
}
