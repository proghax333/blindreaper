
import React from "react";

import { Button, ButtonGroup, Flex, FocusLock, FormControl, FormErrorMessage, FormLabel, Input, Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverTrigger, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import { Edit } from "@emotion-icons/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { api, handleResponse } from "~/lib/http";

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
          {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
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

export function PayloadEdit({ payload }) {
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