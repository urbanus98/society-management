import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import useLogout from "../../hooks/useLogout";

const Users = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [users, setUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("users", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (error) {
        console.error(error);
        // navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort;
    };
  }, []);

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <article>
      <h2>User list</h2>

      {users?.length ? (
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
      <button onClick={signOut}>Logout</button>
    </article>
  );
};

export default Users;
