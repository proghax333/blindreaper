import React from "react";

import { Box, Flex, Divider, Text, useDisclosure } from "@chakra-ui/react";

import { KeyboardArrowDown, ChevronRight, InsertDriveFile, Add, Edit, Delete } from "@emotion-icons/material";

import ActionBarButton from "~/ui/ActionBarButton";

import Captures from "~/modules/payloads/components/captures";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, handleResponse } from "~/lib/http";
import styled from "@emotion/styled";
import { CreatePayloadModal } from "~/modules/payloads/components/create-payload";
import { PayloadEdit } from "~/modules/payloads/components/update-payload";
import { PayloadDelete } from "~/modules/payloads/components/delete-payload";
import { useMemoSortedCollection } from "~/modules/payloads/hooks/payloads.hooks";
import { NodeItem } from "~/modules/payloads/components/node-item";

function TreeCollection({ node: node_, level = 0 }) {
  const LEFT_ICON_SIZE = 18;
  const [isOpen, setIsOpen] = React.useState(false);

  const node = {
    ...node_,
  };
  
  const nodeChildren = useMemoSortedCollection(node.children);

  function handleToggle() {
    setIsOpen(state => !state);
  }

  const IconComponent = nodeChildren
    ? isOpen
      ? KeyboardArrowDown
      : ChevronRight
    : InsertDriveFile;

  return <Box>
    <NodeItem
      pl={`${4 + level * 12 + (nodeChildren == undefined ? 0 : 0)}px`}
      alignItems={"center"}
      cursor={"pointer"}
      onClick={handleToggle}
      _hover={{
        background: "gray.800"
      }}
    >
      <IconComponent m={1} size={LEFT_ICON_SIZE} style={{minWidth: LEFT_ICON_SIZE}} />
      <Text my={1} px={1} flex={1}>{node.name}</Text>
      <PayloadEdit payload={node} />
      <PayloadDelete payload={node} />
    </NodeItem>

    {
      isOpen && nodeChildren &&
      <Box>
        {nodeChildren.map(child => {
          return <TreeCollection
            key={`tree-node-${child.id}`}
            level={level + 1}
            node={child}
          />
        })}
      </Box>
    }
  </Box>
}


function useGetPayloadsQuery(options) {
  return useQuery({
    queryKey: ["/payloads"],
    queryFn: () => handleResponse(
      api.get("/payloads")
    ),
    ...options,
  });
}

export default function MainContent() {
  // const { collections } = payloads;
  const getPayloadsQuery = useGetPayloadsQuery();
  const payloads = useMemoSortedCollection(getPayloadsQuery.data?.itemByDomain("payload")?.data);
  const createPayloadModal = useDisclosure();

  return <Flex
    w="full"
    h="full"
    background="blackAlpha.700"
  >
    <Box
      w={{base:"10rem", md: "14rem"}}
      minW={{base:"10rem", md: "14rem"}}
      h="full"
      background="gray.900"
    >
      <CreatePayloadModal
        isOpen={createPayloadModal.isOpen}
        onOpen={createPayloadModal.onOpen}
        onClose={createPayloadModal.onClose}
      />
      {/* Tree browser */}
      <Flex
        direction={"column"}
        w="full"
        h="full"
      >
        <Flex justifyContent={"space-between"}>
          <Text p={1} px={2} fontWeight={"semibold"} fontSize="small">Payloads</Text>
          <ActionBarButton w={"auto"} h={"auto"} onClick={createPayloadModal.onOpen}>
            <Add size={20} />
          </ActionBarButton>
        </Flex>

        <Divider />

        <Box
          fontSize="sm"
          flex={1}
          overflowY="auto"
          overflowX="auto"
        >
          {payloads && payloads.map(node => {
            return <TreeCollection
              key={`tree-node-${node.id}`}
              node={node}
              level={0}
            />;
          })}
        </Box>
      </Flex>
    </Box>
    <Divider orientation="vertical" />

    <Box
      flex={1}
      background="#080808"
      h="full"
    >
      {getPayloadsQuery.isSuccess && <Captures />}
    </Box>
  </Flex>
}
