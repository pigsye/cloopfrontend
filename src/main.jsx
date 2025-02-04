import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar.jsx";
import Home from "./components/home/home.jsx";
import AddItem from "./components/additem/additem.jsx";
import Chat from "./components/chat/chat.jsx";
import ContactUs from "./components/contactus/contact.jsx"
import Profile from "./components/profile/profile.jsx";
import UserProfile from './components/userprofile/userprofile.jsx';
import Listing from './components/listing/listing.jsx';
import "./components/main.scss";

createRoot(document.getElementById('root')).render(
  <Router>
      <Navbar />
      <div className="app__content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/userprofile/:id" element={<UserProfile />} />
          <Route path="/products/:id" element={<Listing />} />
        </Routes>
      </div>
    </Router>
)
