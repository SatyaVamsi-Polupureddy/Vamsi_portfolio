import React from "react";
import { motion } from "framer-motion";
import "./about.css";

const About = () => {
  const aboutData = {
    title: "About Me",
    subtitle: "Get to know me better",
    description: `I am a passionate Full Stack Developer with a strong foundation in web technologies and a keen eye for creating elegant, efficient, and user-friendly applications. My journey in software development has equipped me with expertise in both frontend and backend technologies, allowing me to build comprehensive solutions that meet modern web standards.`,
    highlights: [
      {
        title: "Problem Solver",
        description: "I enjoy tackling complex challenges and finding efficient solutions through clean, maintainable code.",
      },
     {
        title: "Tech Enthusiast",
        description: "I’m passionate about web development and love learning new technologies to improve my full stack skills."
      },

      {
        title: "Team Player",
        description: "Experienced in collaborating with cross-functional teams to deliver high-quality products.",
      },
    ],
  };

  return (
    <section id="about" className="about-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          {aboutData.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="section-subtitle"
        >
          {aboutData.subtitle}
        </motion.p>

        <div className="about-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="about-description"
          >
            <p>{aboutData.description}</p>
          </motion.div>

          <div className="highlights-grid">
            {aboutData.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="highlight-card"
              >
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 