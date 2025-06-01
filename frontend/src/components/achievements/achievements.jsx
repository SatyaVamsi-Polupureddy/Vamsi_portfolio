import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import "./achievements.css";

const API_BASE_URL = "http://localhost:5000/api";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/achievements`);
        setAchievements(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load achievements");
        setLoading(false);
        console.error("Error fetching achievements:", err);
      }
    };

    fetchAchievements();
  }, []);

  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});

  const handleImageClick = (image) => {
    setSelectedImage(image);
    // Add active class to modal overlay
    const modalOverlay = document.querySelector(".image-modal-overlay");
    if (modalOverlay) {
      modalOverlay.classList.add("active");
    }
  };

  const closeModal = () => {
    // Remove active class from modal overlay
    const modalOverlay = document.querySelector(".image-modal-overlay");
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
    }
    // Small delay to allow for transition
    setTimeout(() => {
      setSelectedImage(null);
    }, 300);
  };

  if (loading) {
    return (
      <section id="achievements" className="achievements-section">
        <div className="container">
          <div className="loading">Loading achievements...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="achievements" className="achievements-section">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="achievements-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Achievements
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="section-subtitle"
        >
          My accomplishments and milestones
        </motion.p>

        <div className="achievements-container">
          {Object.entries(groupedAchievements).map(
            ([category, categoryAchievements], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
                className="achievement-category"
              >
                <h3 className="category-title">{category}</h3>
                <div className="achievements-grid">
                  {categoryAchievements.map((achievement, achievementIndex) => (
                    <motion.div
                      key={achievement._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: achievementIndex * 0.1,
                      }}
                      className="achievement-card"
                    >
                      {achievement.image && (
                        <div className="achievement-image-container">
                          <img
                            src={achievement.image.url}
                            alt={achievement.title}
                            loading="lazy"
                            className="achievement-image"
                          />
                          <div
                            className="image-overlay"
                            onClick={() =>
                              handleImageClick(achievement.image.url)
                            }
                          >
                            <span className="view-image-text">View Image</span>
                          </div>
                        </div>
                      )}
                      <div className="achievement-content">
                        <div className="achievement-header">
                          <h4 className="achievement-title">
                            {achievement.title}
                          </h4>
                          <span className="achievement-category">
                            {achievement.category}
                          </span>
                        </div>
                        {achievement.description && (
                          <p className="achievement-description">
                            {achievement.description}
                          </p>
                        )}
                        {achievement.date && (
                          <span className="achievement-date">
                            {achievement.date.type === "single" &&
                            achievement.date.singleDate
                              ? new Date(
                                  achievement.date.singleDate
                                ).toLocaleDateString()
                              : achievement.date.type === "period" &&
                                achievement.date.startDate &&
                                achievement.date.endDate
                              ? `${new Date(
                                  achievement.date.startDate
                                ).toLocaleDateString()} - ${new Date(
                                  achievement.date.endDate
                                ).toLocaleDateString()}`
                              : null}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Image Modal */}
      <div
        className={`image-modal-overlay ${selectedImage ? "active" : ""}`}
        onClick={closeModal}
      >
        <div
          className="image-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close-button" onClick={closeModal}>
            <FaTimes />
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Achievement"
              className="modal-image"
              loading="eager"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
