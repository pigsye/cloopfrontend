import React from "react";
import "./static.scss";

export default function SustainabilityImpact() {
  return (
    <main className="static-page">
      <section className="section">
        <h1>Sustainability Impact</h1>
        <p>Clothing swaps reduce waste and promote eco-friendly fashion.</p>

        <h2>Why Swap Instead of Buy?</h2>
        <ul>
          <li>Reduces textile waste and landfills.</li>
          <li>Minimizes carbon footprint by cutting down on new clothing production.</li>
          <li>Encourages mindful shopping habits.</li>
        </ul>

        <h2>Fast Fashion vs. Sustainable Fashion</h2>
        <p>Did you know?</p>
        <ul>
          <li>Fast fashion contributes to <strong>10% of global carbon emissions</strong>.</li>
          <li>One cotton t-shirt requires <strong>2,700 liters of water</strong> to produce.</li>
          <li>By swapping, you reduce your <strong>fashion footprint</strong> significantly.</li>
        </ul>
      </section>
    </main>
  );
}