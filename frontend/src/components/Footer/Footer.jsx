import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          Loosely designed in Figma and built with React.js by yours truly.
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} ITP-Grocery-Management-System
        </p>
      </div>
    </footer>
  );
};

export default Footer;
