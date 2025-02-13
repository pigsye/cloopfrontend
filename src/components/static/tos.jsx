import React from "react";
import "./static.scss";

export default function TermsOfService() {
  return (
    <main className="static-page">
      <h1>Terms of Service</h1>

      <section className="section">
        <h2>Introduction</h2>
        <p>Welcome to our platform! By using our services, you agree to these terms.</p>
      </section>

      <section className="section">
        <h2>Usage Guidelines</h2>
        <p>Users must ensure their items are accurately described and follow trade rules.</p>
      </section>

      <section className="section">
        <h2>Privacy Policy</h2>
        <p>We value your privacy and ensure that your data is protected.</p>
      </section>

      <section className="section">
        <h2>Legal Disclaimer</h2>
        <p>We are not responsible for disputes or losses incurred through trading.</p>
      </section>
    </main>
  );
}