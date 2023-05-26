import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const NodeItem = styled(Flex)`
  &:hover > .button-edit-payload, &:hover > .button-delete-payload {
    visibility: visible;
  }
  & .button-edit-payload, & > .button-delete-payload {
    visibility: hidden;
  }
`;