import React, { useRef, useState } from "react";
import Input from "../../Inputs/Input";
import SubmButton from "../../ui/SubmButton";
import { useNavigate } from "react-router-dom";
import Select from "../../ui/Select";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const Register = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    role: "user",
  });

  const values = [
    { id: "admin", name: "Admin" },
    { id: "user", name: "User" },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axiosPrivate.post("register", user);
      navigate("/admin");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Ime"
        name="name"
        placeholder="Ime"
        value={user.name}
        handleChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <Input
        label="Username"
        name="username"
        placeholder="Username"
        value={user.username}
        handleChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        placeholder="Password"
        value={user.password}
        handleChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <div>
        <label htmlFor="role" className="input_label bright-text">
          Vloga
        </label>
        <Select
          name="role"
          values={values}
          defaultvalue={user.role}
          onChange={(e) => {
            setUser({ ...user, role: e.target.value });
          }}
          classes="input width-100"
          withDisabled={false}
        />
      </div>
      <SubmButton text="Dodaj uporabnika" />
    </form>
  );
};

export default Register;
