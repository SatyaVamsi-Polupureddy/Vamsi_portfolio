import React, { useState, useEffect } from "react";
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";
import Navbar from "./components/navbar/navbar";
import Hero from "./components/hero/hero";
import About from "./components/about/about";
import Skills from "./components/skills/skills";
import Projects from "./components/projects/projects";
import Contact from "./components/contact/contact";
import Footer from "./components/footer/footer";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import Education from "./components/education/education";
import Services from "./components/services/services";
import Achievements from "./components/achievements/achievements";
// import Portfolio from "./components/portfolio/portfolio";
// import Footer from "./components/footer/footer";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check session expiry on mount and periodically
  useEffect(() => {
    const checkSession = () => {
      const sessionExpiry = localStorage.getItem("sessionExpiry");
      if (sessionExpiry) {
        if (new Date().getTime() > parseInt(sessionExpiry)) {
          // Session expired
          localStorage.removeItem("sessionExpiry");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    // Check immediately
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      // Hardcoded credentials for now
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sessionExpiry");
    setIsAuthenticated(false);
  };

  return (
    // <Router>
    <div className="App">
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Hero />
                <About />
                <Education />
                <Skills />
                <Services />
                <Projects />
                <Achievements />
                <Contact />
                <Footer />
              </motion.div>
            }
          />
          <Route
            path="/admin"
            element={
              !isAuthenticated ? (
                <AdminLogin onLogin={handleLogin} />
              ) : (
                <Navigate to="/admin/dashboard" replace />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              isAuthenticated ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
    // </Router>
  );
};

export default App;
