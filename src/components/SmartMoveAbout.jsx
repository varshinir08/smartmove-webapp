import React from 'react';
import { MapPin, Bus, Mic, CreditCard, Users } from 'lucide-react';
import './SmartMoveAbout.css';
import logo from '../smartmove_logo.png';
const SmartMoveAbout = () => {
  const keyFeatures = [
    {
      icon: <MapPin className="feature-icon" />,
      title: 'Real-Time Bus Tracking',
      description: 'Track buses live on Google Maps with accurate GPS updates.'
    },
    {
      icon: <Users className="feature-icon" />,
      title: 'Crowdsourced Data Sharing',
      description: 'Users contribute live bus locations for better tracking.'
    },
    {
      icon: <Bus className="feature-icon" />,
      title: 'Seat Availability & Booking',
      description: 'Easily view and book available seats with manual selection or voice commands.'
    },
    {
      icon: <Mic className="feature-icon" />,
      title: 'Voice-Assisted Booking',
      description: 'Book seats hands-free using intuitive voice commands.'
    },
    {
      icon: <CreditCard className="feature-icon" />,
      title: 'Secure Online Payments',
      description: 'Pay securely via Razorpay with UPI, credit/debit cards, and net banking.'
    }
  ];

  const howItWorks = [
    'Enter boarding & destination points to find available buses.',
    'Track buses in real-time and get live updates on seat availability.',
    'Reserve your seat using manual selection or voice commands.',
    'Make secure payments through Razorpay.',
    'Get real-time updates and reach your destination hassle-free.'
  ];

  return (
    <div className="smartmove-container">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <header className="smartmove-header">
        <img src={logo} alt="SmartMove Logo" className="smartmove-logo" />
          <h1 className="smartmove-title">SmartMove: Redefining Public Transport</h1>
          <p className="smartmove-subtitle">
            An innovative real-time bus tracking and seat booking platform 
            designed to enhance urban commuting with cutting-edge technology.
          </p>
        </header>

        {/* Key Features Section */}
        <section className="smartmove-features">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* How It Works Section */}
        <section className="smartmove-how-it-works">
          <h2 className="smartmove-title">How It Works</h2>
          <ol className="space-y-6">
            {howItWorks.map((step, index) => (
              <li key={index} className="how-it-works-step">
                <span className="step-number">{index + 1}</span>
                <span className="feature-description">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Why Choose SmartMove */}
        <section className="smartmove-why-choose">
          {[
            {
              title: 'Reliable Tracking',
              description: 'Stay updated with real-time GPS-based bus movement tracking.'
            },
            {
              title: 'Community-Powered Accuracy',
              description: 'Crowdsourced data ensures precise and reliable bus locations.'
            }
          ].map((item, index) => (
            <div key={index} className="why-choose-card">
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-description">{item.description}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="smartmove-footer">
          <h3 className="smartmove-title">SmartMove – Transforming Urban Mobility</h3>
          <p className="smartmove-subtitle">
            Empowering commuters with smart, efficient, and user-friendly transportation solutions.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SmartMoveAbout;
