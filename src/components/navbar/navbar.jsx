import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="logo">
        <Link to="/">Cloop</Link>
      </div>

      {/* Hamburger Icon (Visible on Mobile) */}
      <button className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Navigation Links (Toggle on Mobile) */}
      <nav className={menuOpen ? "open" : ""}>
        <Link to="contact">Contact Us</Link>
        <Link to="profile">Profile</Link>
        <Link to="chat">Chats</Link>
        <Link to="add-item">
          <button className="trade-btn">Trade</button>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;