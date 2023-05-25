import React from "react";

import { Box, Flex, Divider, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Button, FormLabel, Input, FormControl, useToast } from "@chakra-ui/react";

import { KeyboardArrowDown, ChevronRight, InsertDriveFile, Add } from "@emotion-icons/material";

import ActionBarButton from "~/ui/ActionBarButton";
import { useSelector } from "react-redux";

import Captures from "~/modules/payloads/components/captures";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, handleResponse } from "~/lib/http";

function useMemoSortedCollection(collections) {
  return React.useMemo(() => {
    const colls = collections;

    if(!colls) {
      return colls;
    }

    const result = [...colls];
    result.sort((a, b) => {
      if(a.children && b.children) {
        return a.name.localeCompare(b.name);
      } else if(a.children) {
        return -1;
      } else {
        return 1;
      }
    });

    return result;
  }, [collections]);
}

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
    <Flex
      pl={`${4 + level * 12 + (nodeChildren == undefined ? 0 : 0)}px`}
      alignItems={"center"}
      py={1}
      cursor={"pointer"}
      onClick={handleToggle}
      _hover={{
        background: "gray.800"
      }}
    >
      <IconComponent size={LEFT_ICON_SIZE} style={{minWidth: LEFT_ICON_SIZE}} />
      <Text px={1}>{node.name}</Text>
    </Flex>

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

const createPayloadSchema = z.object({
  name: z.string(),
});

function useCreatePayloadMutation(options = {}) {
  return useMutation({
    mutationFn: (data) => handleResponse(
      api.post("/payloads", data)
    ),
    ...options
  });
}

function CreatePayloadModal({ isOpen, onOpen, onClose, parentIdRef }) {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors }, reset} = useForm({
    resolver: zodResolver(createPayloadSchema),
  });
  const queryClient = useQueryClient();

  const createPayloadMutation = useCreatePayloadMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success!',
        description: data.itemByDomain("payload").message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries(["/payloads"]);
      onClose(data.itemByDomain("payload"));
    },
    onError: () => {
      toast({
        title: 'Update Failed!',
        description:
          error.errorByDomain("account")?.message ||
          error.getError()?.message ||
          error.getRawValue()?.message
        ,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const modalOnClose = onClose;
  onClose = () => {
    reset();
    modalOnClose();
  }

  function onSubmit(data) {
    const payloadData = {
      name: data.name,
      parent_id: null,
    };

    createPayloadMutation.mutate(payloadData);
  }

  return <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Create Payload</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Flex direction={"column"} gap={2}>
              <FormControl>
                <FormLabel>Payload Name</FormLabel>
                <Input {...register("name")} type="text" />
              </FormControl>
            </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
          <Button type="submit" variant='ghost'>Create Payload</Button>
        </ModalFooter>
      </form>
    </ModalContent>
  </Modal>;
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
