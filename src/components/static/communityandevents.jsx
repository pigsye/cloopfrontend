import React from "react";
import "./static.scss";

export default function CommunityEvents() {
  return (
    <main className="static-page">
      <section className="section">
        <h1>Community & Events</h1>
        <p>Join our community and attend clothes swap events.</p>

        <h2>Upcoming Events</h2>
        <ul>
          <li><strong>Local Swap Meetup</strong> - June 15, 2025</li>
          <li><strong>Eco-Fashion Panel</strong> - July 5, 2025</li>
        </ul>
      </section>
    </main>
  );
}