
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const { error, data, isLoading, isFetched } = useAuthState();
  const queryClient = useQueryClient();

  function reload() {
    return queryClient.invalidateQueries({
      queryKey: ["/account"]
    });
  }

  function setData({ user }) {
    queryClient.setQueryData(["/account"], [{ user }]);
  }

  const value = useMemo(() => {
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

    return value;
  }, [data?.itemByDomain("account")?.data]);

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
