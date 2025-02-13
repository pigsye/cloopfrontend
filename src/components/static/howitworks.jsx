import React from "react";
import "./static.scss";

export default function HowItWorks() {
  return (
    <main className="static-page">
      <section className="section">
        <h1>How It Works</h1>
        <p>Discover the easiest way to list, browse, and trade clothes with our seamless platform.</p>

        <div className="steps">
          <div className="step">
            <h2>1. Upload</h2>
            <p>List your clothes with images, descriptions, and relevant tags.</p>
          </div>
          <div className="step">
            <h2>2. Match</h2>
            <p>Find matches based on your preferences and browse available trades.</p>
          </div>
          <div className="step">
            <h2>3. Swap</h2>
            <p>Connect with the other user, finalize the trade, and choose shipping or meetup.</p>
          </div>
        </div>

        <h2>Frequently Asked Questions</h2>
        <p><strong>What condition should my items be in?</strong><br />Items should be clean, undamaged, and as described in the listing.</p>
        <p><strong>How do I resolve a dispute?</strong><br />If there’s an issue, contact support, and we’ll help resolve it.</p>
      </section>
    </main>
  );
}