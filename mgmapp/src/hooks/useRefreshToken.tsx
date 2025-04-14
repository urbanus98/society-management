import axios from "../api/axios";
import useAuth from "./useAuth";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios(`${VITE_API_URL}/refresh`, {
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
