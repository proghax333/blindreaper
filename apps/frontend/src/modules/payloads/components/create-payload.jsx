import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { api, handleResponse } from "~/lib/http";


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

export function CreatePayloadModal({ isOpen, onOpen, onClose, parentIdRef }) {
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
            <FormControl isInvalid={errors.name}>
              <FormLabel>Payload Name</FormLabel>
              <Input {...register("name")} type="text" />
              {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
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