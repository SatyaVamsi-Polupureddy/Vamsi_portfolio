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

    if (section === "admin") {
      navigate("/admin");
    } else {
      // Navigate to home first if not already there, then scroll
      if (window.location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          scrollToSection(section);
        }, 100);
      } else {
        scrollToSection(section);
      }
    }
  };

  const scrollToSection = (section) => {
    // Add a small delay for mobile to ensure menu closes properly
    const isMobile = window.innerWidth <= 768;
    const delay = isMobile ? 100 : 0;

    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, delay);
  };

  const menuItems = [
    { id: "intro", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
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
              <button
                key={item.id}
                className="menu-item"
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
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
              <button
                key={item.id}
                className="mobile-menu-item"
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
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
