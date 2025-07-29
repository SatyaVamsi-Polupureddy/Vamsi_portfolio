import React from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaMobile,
  FaServer,
  FaDatabase,
  FaTools,
  FaSearch,
} from "react-icons/fa";
import "./services.css";

const Services = () => {
  const services = [
    {
      icon: <FaCode />,
      title: "Web Development",
      description:
        "Building responsive and modern web applications using the latest technologies and best practices.",
      features: [
        "Custom website development",
        "Responsive design",
        "Cross-browser compatibility",
        "Performance optimization",
      ],
    },
    {
      icon: <FaMobile />,
      title: "Frontend Development",
      description:
        "Creating beautiful and interactive user interfaces that provide an exceptional user experience.",
      features: [
        "React.js development",
        "UI/UX implementation",
        "Component architecture",
        "State management",
      ],
    },
    {
      icon: <FaServer />,
      title: "Backend Development",
      description:
        "Developing robust and scalable server-side applications with secure APIs and efficient databases.",
      features: [
        "RESTful API development",
        "Server-side programming",
        "Authentication & Authorization",
        "API integration",
      ],
    },
  ];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="section-subtitle"
        >
          What I can do for you
        </motion.p>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="service-card"
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
