import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h2>Explore</h2>
          <ul>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/style-match-guide">Style Match Guide</Link></li>
            <li><Link to="/sustainability-impact">Sustainability Impact</Link></li>
            <li><Link to="/user-success-stories">Success Stories</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Community</h2>
          <ul>
            <li><Link to="/fashion-trends">Fashion Trends</Link></li>
            <li><Link to="/community-events">Community & Events</Link></li>
            <li><Link to="/trade-etiquette">Trade Etiquette</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Cloop. All rights reserved.</p>
      </div>
    </footer>
  );
}