import React, { useState, useEffect } from "react";
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./styles.css";
import Intro3D from "./components/intro3d/Intro3D";
import Navbar from "./components/navbar/navbar";
import Hero from "./components/hero/hero";
import About from "./components/about/about";
import Skills from "./components/skills/skills";
import Projects from "./components/projects/projects";
import Contact from "./components/contact/contact";
import Footer from "./components/footer/footer";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import Experience from "./components/experience/experience";
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
  const [showIntro, setShowIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleIntroComplete = () => {
    setIsTransitioning(true);
    // Add a small delay for smooth transition
    setTimeout(() => {
      setShowIntro(false);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    // <Router>
    <div className="App">
      {showIntro ? (
        <div
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <Intro3D onTransitionComplete={handleIntroComplete} />
        </div>
      ) : (
        <div
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.5s ease-in-out",
            animation: "fadeIn 0.8s ease-in-out",
          }}
        >
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Hero />
                  <About />
                  <Skills />
                  <Experience />
                  <Projects />
                  <Contact />
                  <Footer />
                </div>
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
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
          </Routes>
        </div>
      )}
    </div>
    // </Router>
  );
};

export default App;
