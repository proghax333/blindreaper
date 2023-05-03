import { Box } from "@chakra-ui/react";

export default function Navigation({ children }) {
  return <Box
    display={"flex"}
    flexDirection={"row"}
  >
    {children}
  </Box>
}
