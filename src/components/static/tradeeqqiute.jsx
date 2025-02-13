import React from "react";
import "./static.scss";

export default function TradeEtiquette() {
  return (
    <main className="static-page">
      <section className="section">
        <h1>Trade Etiquette & Quality Standards</h1>
        <p>Ensure a fair and smooth trade by following these guidelines.</p>

        <h2>Do’s</h2>
        <ul>
          <li>Describe your items honestly.</li>
          <li>Ensure clothes are washed and in good condition.</li>
          <li>Communicate clearly with your trade partner.</li>
        </ul>

        <h2>Don’ts</h2>
        <ul>
          <li>Do not misrepresent clothing size or condition.</li>
          <li>Avoid last-minute cancellations.</li>
        </ul>
      </section>
    </main>
  );
}