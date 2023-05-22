
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { handleResponse, api, filterDomain, handleErrors, handleSuccess, select } from "~/lib/http";

const AuthContext = React.createContext();

function useAuthState() {
  return useQuery({
    retry: false,
    queryKey: ["/account"],
    queryFn: () => handleResponse(
      api.get("/account")
    )
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
    value.user = data.itemByDomain("account").data;
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
