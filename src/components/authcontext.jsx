import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedIn(true);
        setUsername(decoded.sub?.username || "User");
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setLoggedIn(false);
      }
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, username }}>
      {children}
    </AuthContext.Provider>
  );
};