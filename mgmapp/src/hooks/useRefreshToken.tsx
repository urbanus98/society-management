import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios("refresh", {
      withCredentials: true,
    });

    setAuth((prev: any) => {
      // console.log(JSON.stringify(prev));
      // console.log(response.data.accessToken);
      return {
        ...prev,
        accessToken: response.data.accessToken,
        name: response?.data?.name,
        id: response?.data?.id,
        role: response?.data?.role,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
