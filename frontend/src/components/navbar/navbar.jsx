import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (section) => {
    setIsOpen(false);

    navigate("/admin");
    // Close mobile menu and scroll to section
  };

  const menuItems = [
    { id: "intro", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-content">
        <div className="logo">
          <a href={`#intro`}>
            <img
              src="/images/logo.png"
              alt="Portfolio Logo"
              className="logo-image"
            />
          </a>
        </div>

        <div className="nav-right">
          <div className="menu">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            className="add-button"
            onClick={() => handleNavClick("admin")}
          >
            Add
          </button>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
          >
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="mobile-menu-item"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              className="mobile-menu-item add-button"
              onClick={() => handleNavClick("admin")}
            >
              Add
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
