import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const nav = useNavigate();
  return (
    <div className="dashboard">
      <div className="left">
        <h1 className="title">
          Let's start <span>Managing Payments</span>
        </h1>
        <p className="subtitle">Manage Payments effectively and easily.</p>
        <div
          className="btn"
          onClick={() => {
            nav("/stores");
          }}
        >
          Get Started
        </div>
      </div>
      <div className="right">
        <img
          src="https://cdn.discordapp.com/attachments/871720769103728671/953610701551841280/unknown.png"
          alt="Image Of Dashboard"
          className="hero-image"
        />
      </div>
    </div>
  );
}
