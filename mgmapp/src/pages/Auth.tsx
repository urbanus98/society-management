import AdminPanel from "../components/Users/AdminPanel";
import Register from "../components/Forms/User/RegisterForm";
import Login from "../components/Forms/User/LoginForm";

export function Admin() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <AdminPanel />
      </div>
    </div>
  );
}

export function RegisterUser() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="bright-text">Register</h1>
        <Register />
      </div>
    </div>
  );
}

export function LoginUser() {
  return (
    <div className="background padding-3 flex justify-center">
      <div className="res-width-2">
        <h1 className="bright-text">Login</h1>
        <Login />
      </div>
    </div>
  );
}
