import { Button } from "@chakra-ui/react";

export default function ActionBarButton({ ...props }) {
  return <Button
    background="none"
    rounded={"none"}
    w="12"
    h="12"
    p={0}
    display="flex"
    flexDirection={"column"}
    {...props}
  />;
}