import React from "react";

import { Box, Flex, Divider, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Button, FormLabel, Input, FormControl, useToast, Popover, PopoverTrigger, PopoverContent, FocusLock, PopoverArrow, PopoverCloseButton, IconButton, Stack, ButtonGroup } from "@chakra-ui/react";

import { KeyboardArrowDown, ChevronRight, InsertDriveFile, Add, Edit, Delete } from "@emotion-icons/material";

import ActionBarButton from "~/ui/ActionBarButton";
import { useSelector } from "react-redux";

import Captures from "~/modules/payloads/components/captures";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, handleResponse } from "~/lib/http";
import styled from "@emotion/styled";

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
;

const editPayloadSchema = z.object({
  name: z.string(),
});

function EditPayloadForm({ firstFieldRef, onClose, payload, onSubmit }) {
  const { register, handleSubmit, formState: { errors }} = useForm({
    resolver: zodResolver(editPayloadSchema),
    defaultValues: {
      name: payload?.name || ""
    }
  });

  const { ref: firstRef, ...firstRest } = register("name");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            ref={(e) => {
              firstRef(e);
              firstFieldRef.current = e;
            }}
            {...firstRest}
            type="text"
          />
        </FormControl>
        <ButtonGroup display='flex' justifyContent='flex-end'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='teal' type="submit">
            Save
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  )
}


function useUpdatePayloadMutation({ payload, ...options }) {
  return useMutation({
    mutationKey: ["/payloads", "update", payload.id],
    mutationFn: (data) => handleResponse(
      api.put(`/payloads/${payload.id}`, data)
    ),
    ...options,
  });
}

function PayloadEdit({ payload }) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const updatePayloadMutation = useUpdatePayloadMutation({
    payload,
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
    onError: (error) => {
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

  function onSubmit(data) {
    updatePayloadMutation.mutate(data);
  }

  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);

  return <Popover
    isOpen={isOpen}
    // initialFocusRef={firstFieldRef}
    onOpen={onOpen}
    onClose={onClose}
    placement='right'
    closeOnBlur={false}
  >
    <PopoverTrigger>
      <Button 
        w={"2"}
        maxW="2"
        h={"7"}
        padding={0}
        margin={0}
        borderRadius={0}
        className="button-edit-payload"
        background={"transparent"}
        display="none"
      >
        <Edit size={16} />
      </Button>
    </PopoverTrigger>
    <PopoverContent p={5}>
      <FocusLock returnFocus persistentFocus={false}>
        <PopoverArrow />
        <PopoverCloseButton />
        <EditPayloadForm firstFieldRef={firstFieldRef} onClose={onClose} payload={payload} onSubmit={onSubmit} />
      </FocusLock>
    </PopoverContent>
  </Popover>;
}

function useDeletePayloadMutation({ payload, ...options }) {
  return useMutation({
    mutationKey: ["/payloads", "delete", payload.id],
    mutationFn: () => handleResponse(
      api.delete(`/payloads/${payload.id}`)
    ),
    ...options
  })
}

function DeletePayloadForm({ onClose, payload, onSubmit }) {
  const { register, handleSubmit, formState: { errors }} = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Confirm delete?</FormLabel>
        </FormControl>
        <ButtonGroup display='flex' justifyContent='flex-end'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='teal' type="submit">
            Delete
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  )
}

function PayloadDelete({ payload }) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const deletePayloadMutation = useDeletePayloadMutation({
    payload,
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
    onError: (error) => {
      toast({
        title: 'Deletion Failed!',
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

  function onSubmit(data) {
    deletePayloadMutation.mutate(data);
  }

  const { onOpen, onClose, isOpen } = useDisclosure();
  // const firstFieldRef = React.useRef(null);

  return <Popover
    isOpen={isOpen}
    // initialFocusRef={firstFieldRef}
    onOpen={onOpen}
    onClose={onClose}
    placement='right'
    closeOnBlur={false}
  >
    <PopoverTrigger>
      <Button 
        w={"2"}
        maxW="2"
        h={"7"}
        padding={0}
        margin={0}
        borderRadius={0}
        className="button-delete-payload"
        background={"transparent"}
        display="none"
      >
        <Delete size={16} />
      </Button>
    </PopoverTrigger>
    <PopoverContent p={5}>
      <FocusLock returnFocus persistentFocus={false}>
        <PopoverArrow />
        <PopoverCloseButton />
        <DeletePayloadForm onClose={onClose} payload={payload} onSubmit={onSubmit} />
      </FocusLock>
    </PopoverContent>
  </Popover>;
}

const NodeItem = styled(Flex)`
  &:hover > .button-edit-payload, &:hover > .button-delete-payload {
    display: flex;
  }
`;

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
    onError: (error) => {
      toast({
        title: 'Failed!',
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
