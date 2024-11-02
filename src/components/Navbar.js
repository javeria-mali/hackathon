import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Doctor's Appointment System</h2>
      <ul className="navbar-links">
        <li>
          <Link to="/doctor">Doctor</Link>
        </li>
        <li>
          <Link to="/patient">Patient</Link>
        </li>
        <li>
          <Link to="Appointment"> Appointment</Link>
        </li>
      </ul>
      {/* Removed the input field and form */}
    </nav>
  );
};

export default Navbar;

