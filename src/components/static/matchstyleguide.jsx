import React from "react";
import "./static.scss";

export default function StyleMatchGuide() {
  return (
    <main className="static-page">
      <section className="section">
        <h1>Style Match Guide</h1>
        <p>Learn how to pick clothes that suit your body type and fashion preferences.</p>

        <h2>Understanding Your Body Type</h2>
        <p>Choose outfits that complement your shape:</p>
        <ul>
          <li><strong>Pear Shape:</strong> A-line skirts and structured tops.</li>
          <li><strong>Apple Shape:</strong> Empire waist dresses and V-neck tops.</li>
          <li><strong>Hourglass Shape:</strong> Fitted clothes that accentuate your waist.</li>
        </ul>

        <h2>Color Coordination</h2>
        <p>Here’s a simple color palette guide:</p>
        <ul>
          <li>Neutral colors like beige, white, and black go with everything.</li>
          <li>Contrast warm and cool tones for a balanced look.</li>
          <li>Monochrome outfits create a sleek, stylish appearance.</li>
        </ul>
      </section>
    </main>
  );
}