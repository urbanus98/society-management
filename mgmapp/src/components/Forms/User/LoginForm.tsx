import React, { useEffect, useRef, useState, useContext } from "react";
import SubmButton from "../../ui/SubmButton";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthProvider";
import axios from "../../../api/axios";
import Alert from "../../ui/Alert";

const Login = () => {
  const navigate = useNavigate();

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { setAuth, persist, setPersist } = context;
  const userRef = useRef<HTMLInputElement | null>(null);
  const errorRef = useRef<HTMLInputElement | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMsg("");
    setAlertVisibility(false);
  }, [user.username, user.password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("auth", JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;

      setAuth({
        ...user,
        role: role,
        accessToken: accessToken,
      });
      setUser({ username: "", password: "" });
      navigate(from, { replace: true });
    } catch (error: any) {
      if (!error.response) {
        setErrorMsg("Server is not responding");
      } else if (error.response.status === 400) {
        setErrorMsg("Missing username or password");
      } else if (error.response.status === 401) {
        setErrorMsg("Invalid username or password");
      } else {
        setErrorMsg("Something went wrong");
      }
      setAlertVisibility(true);
      errorRef.current?.focus();
    }
  };

  const togglePersist = () => {
    setPersist(!persist);
    // localStorage.setItem("persist", JSON.stringify(!persist));
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
          value={user.username}
          autoComplete="username"
          ref={userRef}
          className="input"
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          required
        />
        <label htmlFor="password" className="input_label bright-text">
          Password
        </label>
        <input
          type="password"
          value={user.password}
          autoComplete="current-password"
          className="input"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
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

export default Login;
