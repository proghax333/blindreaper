import { Box, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

export default function NavigationItem({ children, to = "/" }) {
  return <Link
    to={to}
    as={ReactRouterLink}

    _hover={{
      background: "#151516"
    }}
    display={"flex"}
    alignItems={"center"}
    justifyContent={"center"}
    px={5}
    cursor={"pointer"}
    userSelect={"none"}
  >
    {children}
  </Link>
}