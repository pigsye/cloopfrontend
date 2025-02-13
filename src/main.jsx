import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar.jsx";
import Footer from './components/footer/footer.jsx';
import Home from "./components/home/home.jsx";
import AddItem from "./components/additem/additem.jsx";
import Chat from "./components/chat/chat.jsx";
import ContactUs from "./components/contactus/contact.jsx"
import Profile from "./components/profile/profile.jsx";
import UserProfile from './components/userprofile/userprofile.jsx';
import Listing from './components/listing/listing.jsx';
import HowItWorks from './components/static/howitworks.jsx';
import StyleMatchGuide from './components/static/matchstyleguide.jsx';
import SustainabilityImpact from './components/static/sustainabilityimpact.jsx';
import UserSuccessStories from './components/static/usersuccessstories.jsx';
import FashionTrends from './components/static/fashiontrendsandinspiration.jsx';
import CommunityEvents from './components/static/communityandevents.jsx';
import TradeEtiquette from './components/static/tradeeqqiute.jsx';
import TermsOfService from './components/static/tos.jsx';
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
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/style-match-guide" element={<StyleMatchGuide />} />
          <Route path="/sustainability-impact" element={<SustainabilityImpact />} />
          <Route path="/user-success-stories" element={<UserSuccessStories />} />
          <Route path="/fashion-trends" element={<FashionTrends />} />
          <Route path="/community-events" element={<CommunityEvents />} />
          <Route path="/trade-etiquette" element={<TradeEtiquette />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </div>
      <Footer />
    </Router>

)
