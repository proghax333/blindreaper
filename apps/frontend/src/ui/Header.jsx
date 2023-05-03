import { Box } from "@chakra-ui/react";

export default function Header({ children }) {  
  return <Box
    display="flex"
    flexDirection={"row"}
    width={"full"}
    justifyContent={"space-between"}
    flexWrap={"wrap"}
  >
    {children}
  </Box>
}