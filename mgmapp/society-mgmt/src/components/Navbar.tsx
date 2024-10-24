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
          <NavLink to={"/invoices"}>Racuni</NavLink>
        </li>
        <li>
          <NavLink to={"/black"}>Crnu</NavLink>
        </li>
        <li>
          <NavLink to={"/stats"}>Stats</NavLink>
        </li>
      </ul>
    </nav>
    // <header className="flex align-center navbar">
    //   <h2>
    //     <a href="/" className="navbar-link margin-left">
    //       Navbar
    //     </a>
    //   </h2>
    //   <nav className="flex padding-lr">
    //     <a href="/invoices" className="navbar-link">
    //       Racuni
    //     </a>
    //     <a href="/invoices" className="navbar-link">
    //       Crnu
    //     </a>
    //     <a href="/invoices" className="navbar-link">
    //       Statiskika
    //     </a>
    //   </nav>
    // </header>
  );
};
