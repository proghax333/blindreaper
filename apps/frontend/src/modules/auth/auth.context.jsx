
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import { handleResponse, api } from "~/lib/http";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

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
  const queryClient = useQueryClient();

  const { error, data, isLoading, isFetched } = useAuthState();

  function reload() {
    return queryClient.invalidateQueries({
      queryKey: ["/account"]
    });
  }

  async function login(credentials) {
    const result = await loginMutation.mutateAsync(credentials);
    return result;
  }

  async function logout() {
    await queryClient.setQueryData(["/account"], () => {
      return null;
    });
    return reload();
  };

  function setData({ user }) {
    queryClient.setQueryData(["/account"], [{ user }]);
  }

  const value = {
    isLoggedIn: false,
    user: null,
    reload,
    login,
    logout,
    setData,
  };

  if(data) {
    value.isLoggedIn = true;
    value.user = data.itemByDomain("account").data;
  }

  // console.log(value);

  return <AuthContext.Provider value={value}>
    {!isLoading && children}
  </AuthContext.Provider>
}
