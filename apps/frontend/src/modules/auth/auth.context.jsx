
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { api, filterDomain, handleErrors, handleSuccess, select } from "~/lib/http";
import * as R from "ramda";
import { transformK } from "~/lib/utils";

const AuthContext = React.createContext();

function useAuthState() {
  return useQuery({
    retry: false,
    queryKey: ["/account"],
    queryFn: () => api
      .get("/account")
      .then(handleSuccess("account"))
      .catch(handleErrors("account"))
  });
}

export function AuthProvider({ children }) {
  const { error, data, isLoading, isFetched } = useAuthState();
  const queryClient = useQueryClient();

  function reload() {
    queryClient.invalidateQueries({
      queryKey: ["/account"]
    });
  }

  function setData({ user }) {
    queryClient.setQueryData(["/account"], [{ user }]);
  }

  const value = {
    isLoggedIn: false,
    user: null,
    reload,
    setData,
  };

  if(data) {
    value.isLoggedIn = true;
    value.user = data.data.items[0].data;
  }

  // console.log({
  //   isLoading,
  //   data,
  //   error
  // });

  // console.log("Auth state: ", value);


  return <AuthContext.Provider value={value}>
    {!isLoading && children}
  </AuthContext.Provider>
}
