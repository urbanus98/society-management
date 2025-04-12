import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import editIcon from "../../assets/icons/edit_bs.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
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

  return (
    <article>
      {users?.length ? (
        <div className="black-back pad-1r border-radius width-100 coluflex gap justify-between">
          <table className="bright-text">
            <tr>
              <th>ID</th>
              <th>Upor. ime</th>
              <th>Ime</th>
              <th></th>
            </tr>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td key={`${user.id}-id`}>{user.id}</td>
                <td key={`${user.id}-un`}>{user.username}</td>
                <td key={`${user.id}-name`}>{user.name}</td>
                <td key={`${user.id}-edit`}>
                  <Link to={`/users/${user.id}/edit`}>
                    <img src={editIcon} alt="edit" width={20} />
                  </Link>
                </td>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        <p>No users found</p>
      )}
    </article>
  );
};

export default Users;
