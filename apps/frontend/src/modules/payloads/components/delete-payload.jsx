
import React from "react";

import { Button, ButtonGroup, Flex, FocusLock, FormControl, FormLabel, Input, Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverTrigger, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import { Delete, Edit } from "@emotion-icons/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { api, handleResponse } from "~/lib/http";

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

export function PayloadDelete({ payload }) {
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
        display="flex"
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