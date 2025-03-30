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
      <Link
        to={"/"}
        className="title"
        onClick={() => {
          setMenuOpen(false);
        }}
      >
        Society Management
      </Link>
      <div
        className={`menu ${menuOpen ? "open" : ""}`}
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
          {auth.role === "admin" && (
            <li>
              <NavLink
                to={"/admin"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                AdminPanel
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to={"/events"}
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              Dogodki
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/merch"}
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              Merch
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/traffic"}
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              Finance
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/black"}
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              Črnu
            </NavLink>
          </li>
          <li
            className="user-menu"
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            <a onClick={signOut} style={{ cursor: "pointer" }}>
              <i>Logout</i>
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};
