import React from "react";
import "./hero.css";
import { TbDownload } from "react-icons/tb";
import { motion } from "framer-motion";
import heroBg from "../../assets/images/hero-bg.png";

const Hero = () => {
  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Satya_Vamsi_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="intro" className="hero-section">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="introContent"
        >
          <span className="hello">Hello, I'm</span>
          <span className="introText">
            <span className="introName">Satya Vamsi Polupureddy</span>
            {/* <br /> */}
            Web Developer
          </span>
          <p className="introPara">
            Aspiring Full-Stack Web Developer passionate about building dynamic,
            user-friendly web applications.
          </p>
          <div className="button-container">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="resumeDownload"
              onClick={handleResumeDownload}
            >
              Resume
              <TbDownload className="download-icon" size={20} />
            </motion.button>
            <motion.a
              href={import.meta.env.VITE_EMAIL_LINK}
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hireMeButton"
            >
              Hire Me
            </motion.a>
          </div>
        </motion.div>
      </div>
      <div className="hero-image">
        <img src={heroBg} alt="Background" className="bg" />
      </div>
    </section>
  );
};

export default Hero;
