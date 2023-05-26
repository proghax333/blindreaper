
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, handleResponse } from "~/lib/http";

function useLogoutMutation(options = {}) {
  return useMutation({
    mutationKey: ["/auth/logout"],
    mutationFn: () => handleResponse(
      api.post("/auth/logout")
    ),
    ...options,
  })
}

export default function Logout() {
  const toast = useToast();
  const navigate = useNavigate();
  const loggingOutToastRef = React.useRef(null);

  function closeLoading() {
    toast.close(loggingOutToastRef.current);
  }

  const logoutMutation = useLogoutMutation({
    onMutate: () => {
      loggingOutToastRef.current = toast({
        title: 'Logging out...',
        status: 'loading',
      });
    },
    onSuccess: (data) => {
      closeLoading();

      toast({
        title: 'Success!',
        description: data.itemByDomain("auth").message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate("/auth/login");
    },
    onError: (error) => {
      closeLoading();

      toast({
        title: 'Logout Failed!',
        description:
          error.errorByDomain("auth")?.message ||
          error.getError()?.message ||
          error.getRawValue()?.message
        ,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      navigate("/auth/login");
    }
  });

  useEffect(() => {
    logoutMutation.mutate();
  }, []);

  return null;
}
