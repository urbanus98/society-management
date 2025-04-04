import AdminPanel from "../components/Users/AdminPanel";
import BackWTitle from "../components/BackWTitle";
import LoginForm from "../components/Forms/User/LoginForm";
import RegisterForm from "../components/Forms/User/RegisterForm";
import UpdateUserForm from "../components/Forms/User/UpdateUserForm";

export function Admin() {
  return (
    <div className="padding-3 flex justify-center">
      <div className="res-width-30">
        <AdminPanel />
      </div>
    </div>
  );
}

export function RegisterUser() {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Registriraj uporabnika" />
      <div className="res-width-30">
        <RegisterForm />
      </div>
    </div>
  );
}

export function LoginUser() {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Prijava" />
      <div className="res-width-30">
        <LoginForm />
      </div>
    </div>
  );
}

export function UpdateUser() {
  return (
    <div className="padding-3 coluflex justify-center align-center">
      <BackWTitle title="Posodobi podatke" />
      <div className="res-width-30">
        <UpdateUserForm />
      </div>
    </div>
  );
}
