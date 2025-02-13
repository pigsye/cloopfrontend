import React from "react";
import "./static.scss";

export default function FashionTrends() {
  return (
    <main className="static-page">
      <section className="section">
        <h1>Fashion Trends & Inspiration</h1>
        <p>Stay stylish without fast fashion.</p>

        <h2>Seasonal Trends</h2>
        <p>Explore what’s trending:</p>
        <ul>
          <li>Spring: Floral dresses & pastel tones.</li>
          <li>Summer: Breathable linen & flowy skirts.</li>
          <li>Fall: Layered looks with earthy tones.</li>
          <li>Winter: Cozy sweaters & structured coats.</li>
        </ul>
      </section>
    </main>
  );
}