import axios from "../api/axios";
import useAuth from "./useAuth";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      await axios(`${VITE_API_URL}/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
