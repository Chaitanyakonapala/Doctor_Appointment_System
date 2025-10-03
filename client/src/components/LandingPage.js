import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">MediBook</h1>
        <div className="nav-buttons">
          <button className="btn-outline" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h2>
            Book Your Doctor’s Appointment <br /> Anytime, Anywhere
          </h2>
          <p>
            MediBook helps you connect with top specialists, manage bookings
            easily, and never miss an appointment with smart reminders.
          </p>
          <button
            className="btn-primary hero-btn"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h3>Why Choose MediBook?</h3>
        <div className="feature-list">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h4>Easy Bookings</h4>
            <p>Schedule your appointments in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h4>Smart Reminders</h4>
            <p>Get notified so you never miss your appointments.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h4>Top Specialists</h4>
            <p>Connect with the best doctors and healthcare experts.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} MediBook. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
