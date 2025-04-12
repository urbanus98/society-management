import React, { useEffect, useRef, useState, useContext } from "react";
import SubmButton from "../../ui/SubmButton";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthProvider";
import axios from "../../../api/axios";
import Alert from "../../ui/Alert";

const LoginForm = () => {
  const navigate = useNavigate();

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { setAuth, persist } = context;
  const userRef = useRef<HTMLInputElement | null>(null);
  const errorRef = useRef<HTMLInputElement | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [errorMsg, setErrorMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMsg("");
    setAlertVisibility(false);
  }, [username, password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "/auth",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;

      setAuth({
        username: username,
        role: role,
        accessToken: accessToken,
        name: response?.data?.name,
        id: response?.data?.id,
      });
      setUsername("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (error: any) {
      if (!error.response) {
        setErrorMsg("Server is not responding");
      } else if (error.response.status === 400) {
        setErrorMsg("Missing username or password");
      } else if (error.response.status === 401) {
        setErrorMsg("Invalid username or password");
      } else if (error.response.status === 429) {
        setErrorMsg("Too many attempts. Try again later.");
      } else {
        setErrorMsg("Something went wrong");
      }
      setAlertVisibility(true);
      errorRef.current?.focus();
    }
  };

  useEffect(() => {
    localStorage.setItem("persist", persist.toString());
  }, [persist]);

  return (
    <form onSubmit={handleSubmit}>
      {alertVisible && (
        <Alert color="danger" onClose={() => setAlertVisibility(false)}>
          {errorMsg}
        </Alert>
      )}
      <div className="coluflex">
        <label htmlFor="username" className="input_label bright-text">
          Username
        </label>
        <input
          value={username}
          autoComplete="username"
          ref={userRef}
          className="input"
          onChange={(e) => setUsername(e.target.value as string)}
          required
        />
        <label htmlFor="password" className="input_label bright-text">
          Password
        </label>
        <input
          type="password"
          value={password}
          autoComplete="current-password"
          className="input"
          onChange={(e) => setPassword(e.target.value as string)}
          required
        />
      </div>
      <div></div>
      <SubmButton text="Prijava" />
      {/* <div className="width100 flex gap">
        <input
          type="checkbox"
          id="persist"
          onChange={togglePersist}
          className="bigcheck"
          checked={persist}
        />
        <label htmlFor="persist" className="bright-text">
          Trust this device
        </label>
      </div> */}
    </form>
  );
};

export default LoginForm;
