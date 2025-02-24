import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import useAuth from "./hooks/useAuth";
import useLogout from "./hooks/useLogout";

export const Navbar = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to={"/"} className="title">
        Society Management
      </Link>
      <div
        className="menu"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      {auth.accessToken && (
        <ul className={menuOpen ? "open" : ""}>
          {auth.role == "admin" && (
            <li>
              <NavLink to={"/admin"}>AdminPanel</NavLink>
            </li>
          )}
          <li>
            <NavLink to={"/events"}>Dogodki</NavLink>
          </li>
          <li>
            <NavLink to={"/merch"}>Merch</NavLink>
          </li>
          <li>
            <NavLink to={"/invoices"}>Računi</NavLink>
          </li>
          <li>
            <NavLink to={"/black"}>Črnu</NavLink>
          </li>
          {/* <li>
            <NavLink to={"/stats"}>Stats</NavLink>
          </li> */}
          <li className="user-menu">
            <a onClick={signOut} style={{ cursor: "pointer" }}>
              <i>Logout</i>
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};
