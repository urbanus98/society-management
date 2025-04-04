import React, { useEffect, useState } from "react";
import Input from "../../Inputs/Input";
import SubmButton from "../../ui/SubmButton";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../ui/Alert";

const UpdateUserForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();
  const [alertVisible, setAlertVisibility] = useState(false);

  useEffect(() => {
    axiosPrivate
      .get(`users/${id}`)
      .then((response) => {
        setName(response.data.name);
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== cpassword) {
      setAlertVisibility(true);
      return;
    }

    try {
      await axiosPrivate.put(`users/${id}`, { name, username, password });
      navigate("/");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alertVisible && (
        <Alert color="danger" onClose={() => setAlertVisibility(false)}>
          "Gesli se ne ujemata!"
        </Alert>
      )}
      <Input
        label="Ime"
        name="name"
        placeholder="Ime"
        value={name}
        handleChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Username"
        name="username"
        placeholder="Username"
        value={username}
        handleChange={(e) => setUsername(e.target.value)}
      />
      <Input
        name="password"
        label="Novo geslo"
        type="password"
        placeholder="Password"
        value={password}
        handleChange={(e) => setPassword(e.target.value)}
      />
      <Input
        name="cpassword"
        label="Potrdi geslo"
        type="password"
        placeholder="Confirm password"
        value={cpassword}
        handleChange={(e) => setCpassword(e.target.value)}
      />

      <SubmButton text="Posodobi" />
    </form>
  );
};

export default UpdateUserForm;
