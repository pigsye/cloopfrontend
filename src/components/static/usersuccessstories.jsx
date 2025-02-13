import React from "react";
import "./static.scss";

export default function UserSuccessStories() {
  return (
    <main className="static-page">
      <section className="section">
        <h1>User Success Stories</h1>
        <p>See how real users transformed their wardrobes sustainably.</p>

        <div className="story">
          <h2>Emma, 25</h2>
          <p>"I swapped my old jackets for stylish new ones. Love how easy it is!"</p>
        </div>
        <div className="story">
          <h2>Mark, 30</h2>
          <p>"Saved money and got high-quality vintage pieces. Highly recommend!"</p>
        </div>
      </section>
    </main>
  );
}