import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const form = useRef();

  const sendEmail = async (e) => {
    try {
      const result = await emailjs.sendForm(
        "service_gmwrbud",
        "template_9k2tow9",
        form.current,
        "QmBdYsn3Br0_QcIuc"
      );
      console.log("SUCCESS!", result.text);
      return true;
    } catch (error) {
      console.log("FAILED...", error.text);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending message..." });

    try {
      await sendEmail();

      setStatus({
        type: "success",
        message: "Message sent successfully! I will get back to you soon.",
      });

      setFormData({
        from_name: "",
        from_email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      content: "p.s.vamsi2021@gmail.com",
      link: "mailto:p.s.vamsi2021@gmail.com",
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      content: "+91 9182242042",
      link: "tel:+919182242042",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Location",
      content: "Nuzvid, Andhra Pradesh, Kakinada",
      link: "https://maps.google.com",
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub />,
      title: "GitHub",
      link: "https://github.com/SatyaVamsi-Polupureddy",
    },
    {
      icon: <FaLinkedin />,
      title: "LinkedIn",
      link: "https://linkedin.com/in/Satya Vamsi Polupureddy",
    },
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Contact
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="section-subtitle"
        >
          Get in touch with me
        </motion.p>

        <div className="contact-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="contact-info"
          >
            <div className="info-cards">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-card"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="info-icon">{info.icon}</div>
                  <h3 className="info-title">{info.title}</h3>
                  <p className="info-content">{info.content}</p>
                </motion.a>
              ))}
            </div>

            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {social.icon}
                  <span className="social-title">{social.title}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="contact-form-container"
          >
            <form onSubmit={handleSubmit} className="contact-form" ref={form}>
              <div className="form-group">
                <input
                  type="text"
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="from_email"
                  value={formData.from_email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows="5"
                />
              </div>
              <button type="submit" className="submit-button">
                Send Message
              </button>
              {status.message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`status-message ${status.type}`}
                >
                  {status.message}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
