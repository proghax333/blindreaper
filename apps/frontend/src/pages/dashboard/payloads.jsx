import React from "react";

import { Box, Flex, Divider, Text, useDisclosure } from "@chakra-ui/react";

import { KeyboardArrowDown, ChevronRight, InsertDriveFile, Add } from "@emotion-icons/material";

import ActionBarButton from "~/ui/ActionBarButton";

import Captures from "~/modules/payloads/components/captures";
import { useQuery } from "@tanstack/react-query";
import { api, handleResponse } from "~/lib/http";
import { CreatePayloadModal } from "~/modules/payloads/components/create-payload";
import { PayloadEdit } from "~/modules/payloads/components/update-payload";
import { PayloadDelete } from "~/modules/payloads/components/delete-payload";
import { useMemoSortedCollection } from "~/modules/payloads/hooks/payloads.hooks";
import { NodeItem } from "~/modules/payloads/components/node-item";
import { useNavigate, useParams } from "react-router-dom";

function TreeCollection({
  node: node_,
  level = 0,
  selected,
  onPayloadOpen,
  onPayloadClose,
  isConstant = false,
  icon
}) {
  const LEFT_ICON_SIZE = 18;
  const [isOpen, setIsOpen] = React.useState(false);

  const node = {
    ...node_,
  };
  
  const nodeChildren = useMemoSortedCollection(node.children);

  function handleToggle() {
    setIsOpen(state => !state);
  }

  const IconComponent = icon || (nodeChildren
    ? isOpen
      ? KeyboardArrowDown
      : ChevronRight
    : InsertDriveFile);

  function onSelect() {
    if(selected?.id === node.id) {
      onPayloadClose(node);
    } else {
      onPayloadOpen(node);
    }
  }
  
  return <Box>
    <NodeItem
      pl={`${4 + level * 12 + (nodeChildren == undefined ? 0 : 0)}px`}
      alignItems={"center"}
      cursor={"pointer"}
      onClick={handleToggle}
      _hover={{
        background: selected?.id === node.id ? "gray.700" : "gray.800"
      }}
      background={selected?.id === node.id ? "gray.700" : null}
    >
      <IconComponent m={1} size={LEFT_ICON_SIZE} style={{minWidth: LEFT_ICON_SIZE}} />
      <Text my={1} px={1} flex={1} onClick={onSelect}>{node.name}</Text>
      {!isConstant && <>
        <PayloadEdit payload={node} />
        <PayloadDelete payload={node} />
      </>}
    </NodeItem>

    {
      isOpen && nodeChildren &&
      <Box>
        {nodeChildren.map(child => {
          return <TreeCollection
            key={`tree-node-${child.id}`}
            level={level + 1}
            node={child}

            selected={selected}
            onPayloadOpen={onPayloadOpen}
            onPayloadClose={onPayloadClose}
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

const nodeShowAll = {
  id: "root",
  name: "Show All"
};

export default function MainContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const getPayloadsQuery = useGetPayloadsQuery();
  const payloads = useMemoSortedCollection(getPayloadsQuery.data?.itemByDomain("payload")?.data);
  const createPayloadModal = useDisclosure();

  const selected = {
    id: id || "root",
  };

  function onPayloadOpen(payload) {
    navigate(`/dashboard/payloads/${payload.id}`);
  }
  function onPayloadClose(payload) {
    navigate(`/dashboard/payloads`);
  }

  return <Flex
    w="full"
    h="full"
    background="blackAlpha.700"
  >
    <Box
      w={"14rem"}
      minW={"14rem"}
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
          {/* <TreeCollection
            key={`tree-node-show-all`}
            node={nodeShowAll}
            level={0}

            isConstant={true}
            selected={selected}
            onPayloadOpen={onPayloadOpen}
            onPayloadClose={onPayloadClose}
            icon={Star}
          /> */}

          {payloads && payloads.map(node => {
            return <TreeCollection
              key={`tree-node-${node.id}`}
              node={node}
              level={0}

              selected={selected}
              onPayloadOpen={onPayloadOpen}
              onPayloadClose={onPayloadClose}
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
      {
        getPayloadsQuery.isSuccess &&
        selected &&
          <Captures payload={selected} />
      }
    </Box>
  </Flex>
}
