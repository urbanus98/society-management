import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <ul className={menuOpen ? "open" : ""}>
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
          <NavLink to={"/traffic"}>Promet</NavLink>
        </li>
        <li>
          <NavLink to={"/black"}>črnu</NavLink>
        </li>
        <li>
          <NavLink to={"/stats"}>Stats</NavLink>
        </li>
      </ul>
    </nav>
  );
};
