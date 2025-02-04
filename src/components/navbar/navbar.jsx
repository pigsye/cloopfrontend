import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <header>
        <div className="logo"><Link to="/">Cloop</Link></div>
        <nav>
            <Link to="contact">Contact Us</Link>
            <Link to="profile">Profile</Link>
            <Link to="add-item"><button className="trade-btn">Trade</button></Link>
        </nav>
    </header>
  );
};

export default Navbar;