import { useQuery } from "@tanstack/react-query";
import { ApiService } from "./apiService";
import { LoginContext } from "../context/loginContext";
import { useContext } from "react";

function GlobalDataFetch() {
  let { userData, accessToken } = useContext(LoginContext);

  const fetchFunction = async () => {
    const response = await ApiService.getSelfUser(userData.id, accessToken);

    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllUserData"],
    queryFn: fetchFunction,
    config: {
      refetchInterval: 50 * 1000,
    },
  });

  return { data, isLoading, isError };
}

export default GlobalDataFetch;
