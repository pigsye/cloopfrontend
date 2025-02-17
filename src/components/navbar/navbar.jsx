import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authcontext"; // ✅ Import Auth Context
import API from "../../api"; // ✅ Import API for requests
import "./Navbar.scss";

const Navbar = () => {
  const { loggedIn, setLoggedIn, username } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔹 Check if the user is disabled and auto-logout (ONLY if logged in)
  useEffect(() => {
    if (!loggedIn) return; // ✅ Prevent API call if user is not logged in

    const token = localStorage.getItem("token");
    if (!token) return; // ✅ Prevent unnecessary API calls

    async function checkAccountStatus() {
      try {
        const response = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.disabled) {
          console.warn("🔴 Account is disabled. Logging out...");
          handleLogout();
        }
      } catch (err) {
        console.error("⚠️ Error checking account status:", err.response?.data || err);
        // ❌ DO NOT LOG OUT ON EVERY ERROR (Only if 403 Forbidden)
        if (err.response?.status === 403) {
          handleLogout();
        }
      }
    }

    checkAccountStatus();
  }, [loggedIn]); // ✅ Runs only when `loggedIn` state changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false); // ✅ Update global state
    navigate("/login");
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">Cloop</Link>
      </div>

      <button className="hamburger-menu">☰</button>

      <nav>
        <Link to="contact">Contact Us</Link>
        {loggedIn && <Link to="profile">Profile</Link>}
        {loggedIn && <Link to="chat">Chats</Link>}
        <Link to="add-item">
          <button className="trade-btn">Trade</button>
        </Link>

        {!loggedIn ? (
          <Link to="login">
            <button className="login-btn">Login</button>
          </Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;