import { Box } from "@chakra-ui/react";

export default function TwoColsLayout({ ...props }) {
  return <Box
    display={"flex"}
    flexDirection={{base: "column", md: "row"}}
    w="full"
    height="full"
    {...props}
  />  
}
