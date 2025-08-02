import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config/api.js";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    projects: {
      title: "",
      description: "",
      technologies: "",
      image: "",
      liveLink: "",
      githubLink: "",
    },
    achievements: {
      title: "",
      description: "",
      category: "",
      date: {
        type: "single",
        singleDate: "",
        startDate: "",
        endDate: "",
      },
      image: "",
      link: "",
    },
    experiences: {
      jobTitle: "",
      company: "",
      description: "",
      location: "",
      employmentType: "Full-time",
      startDate: "",
      endDate: "",
      isCurrent: false,
      technologies: "",
      achievements: "",
      companyLogo: "",
    },
  });
  const [imagePreview, setImagePreview] = useState({
    projects: null,
    achievements: null,
    experiences: null,
  });
  const fileInputRef = useRef({
    projects: null,
    achievements: null,
    experiences: null,
  });

  // Ensure all form fields are properly initialized
  useEffect(() => {
    setFormData({
      projects: {
        title: "",
        description: "",
        technologies: "",
        image: "",
        liveLink: "",
        githubLink: "",
      },
      achievements: {
        title: "",
        description: "",
        category: "",
        date: {
          type: "single",
          singleDate: "",
          startDate: "",
          endDate: "",
        },
        image: "",
        link: "",
      },
      experiences: {
        jobTitle: "",
        company: "",
        description: "",
        location: "",
        employmentType: "Full-time",
        startDate: "",
        endDate: "",
        isCurrent: false,
        technologies: "",
        achievements: "",
        companyLogo: "",
      },
    });
  }, []);

  const handleClose = () => {
    navigate("/");
  };

  const handleLogout = () => {
    onLogout();
    navigate("/admin");
  };

  const handleInputChange = (e, type) => {
    const { name, value, type: inputType, checked } = e.target;
    if (type === "achievements" && name.startsWith("date.")) {
      const dateField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        achievements: {
          ...prev.achievements,
          date: {
            ...prev.achievements.date,
            [dateField]: value || "",
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [name]: inputType === "checkbox" ? checked : value || "",
        },
      }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => ({
          ...prev,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...(type === "projects"
          ? {
              title: "",
              description: "",
              technologies: "",
              image: "",
              liveLink: "",
              githubLink: "",
            }
          : type === "achievements"
          ? {
              title: "",
              description: "",
              category: "",
              date: {
                type: "single",
                singleDate: "",
                startDate: "",
                endDate: "",
              },
              image: "",
              link: "",
            }
          : {
              jobTitle: "",
              company: "",
              description: "",
              location: "",
              employmentType: "Full-time",
              startDate: "",
              endDate: "",
              isCurrent: false,
              technologies: "",
              achievements: "",
              companyLogo: "",
            }),
      },
    }));
    setImagePreview((prev) => ({
      ...prev,
      [type]: null,
    }));
    if (fileInputRef.current[type]) {
      fileInputRef.current[type].value = "";
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Saving changes..." });

    try {
      let endpoint = "";
      const formDataToSend = new FormData();

      // Validate required fields before sending
      if (type === "projects" || type === "achievements") {
        if (!formData[type].title) {
          throw new Error("Title is required");
        }
      }
      if (type === "experiences") {
        if (!formData[type].jobTitle) {
          throw new Error("Job title is required");
        }
        if (!formData[type].company) {
          throw new Error("Company is required");
        }
      }
      if (type === "achievements" && !formData[type].category) {
        throw new Error("Category is required");
      }
      if (type === "projects") {
        if (!formData[type].description) {
          throw new Error("Description is required");
        }
        if (!formData[type].technologies) {
          throw new Error("Technologies are required");
        }
        if (!fileInputRef.current[type]?.files[0]) {
          throw new Error("Project image is required");
        }
      }
      if (type === "experiences") {
        if (!formData[type].description) {
          throw new Error("Description is required");
        }
        if (!formData[type].startDate) {
          throw new Error("Start date is required");
        }
        if (formData[type].isCurrent === false && !formData[type].endDate) {
          throw new Error("End date is required for past positions");
        }
      }

      // Add all form fields to FormData
      Object.keys(formData[type]).forEach((key) => {
        if (key === "technologies" && type === "projects") {
          const techValue = JSON.stringify(
            formData[type][key].split(",").map((tech) => tech.trim())
          );
          formDataToSend.append(key, techValue);
          console.log(`Adding ${key}:`, techValue);
        } else if (key === "date" && type === "achievements") {
          const dateValue = JSON.stringify(formData[type][key]);
          formDataToSend.append(key, dateValue);
          console.log(`Adding ${key}:`, dateValue);
        } else if (key === "technologies" && type === "experiences") {
          const techValue = JSON.stringify(
            formData[type][key]
              .split(",")
              .map((tech) => tech.trim())
              .filter((tech) => tech)
          );
          formDataToSend.append(key, techValue);
          console.log(`Adding ${key}:`, techValue);
        } else if (key === "achievements" && type === "experiences") {
          const achievementsValue = JSON.stringify(
            formData[type][key]
              .split(",")
              .map((achievement) => achievement.trim())
              .filter((achievement) => achievement)
          );
          formDataToSend.append(key, achievementsValue);
          console.log(`Adding ${key}:`, achievementsValue);
        } else if (key !== "image" && key !== "companyLogo") {
          formDataToSend.append(key, formData[type][key]);
          console.log(`Adding ${key}:`, formData[type][key]);
        }
      });

      // Add image if selected
      const fileInput = fileInputRef.current[type];
      if (fileInput && fileInput.files[0]) {
        const fieldName = type === "experiences" ? "companyLogo" : "image";
        formDataToSend.append(fieldName, fileInput.files[0]);
        console.log(`Adding ${fieldName} file:`, fileInput.files[0].name);
      }

      // Log all form data entries for debugging
      console.log("Form data entries:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      switch (type) {
        case "projects":
          endpoint = `${API_BASE_URL}/projects`;
          break;
        case "achievements":
          endpoint = `${API_BASE_URL}/achievements`;
          // Normalize category to lowercase for validation
          const category = formData[type].category.toLowerCase();
          if (
            ![
              "certification",
              "award",
              "competition",
              "publication",
              "other",
            ].includes(category)
          ) {
            throw new Error("Invalid achievement category");
          }
          // Update the category in formData to ensure consistent case
          formDataToSend.set("category", category);
          break;
        case "experiences":
          endpoint = `${API_BASE_URL}/experiences`;
          break;
        default:
          throw new Error("Invalid form type");
      }

      console.log("Sending request to:", endpoint);
      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response.data);

      setStatus({
        type: "success",
        message: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } added successfully!`,
      });

      // Clear form and image preview
      clearForm(type);
      setImagePreview((prev) => ({
        ...prev,
        [type]: null,
      }));
      if (fileInputRef.current[type]) {
        fileInputRef.current[type].value = "";
      }

      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("API Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });

      let errorMessage = "Failed to save changes. Please try again.";

      if (error.response?.data) {
        // Handle server validation errors
        if (error.response.data.details) {
          const validationErrors = Object.values(error.response.data.details)
            .map((err) => err.message)
            .join(", ");
          errorMessage = validationErrors || error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        // Handle client-side validation errors
        errorMessage = error.message;
      }

      setStatus({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const achievementCategories = [
    "Certification",
    "Award",
    "Competition",
    "Publication",
    "Other",
  ];

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
  ];

  const renderForm = () => {
    switch (activeTab) {
      case "projects":
        return (
          <form
            onSubmit={(e) => handleSubmit(e, "projects")}
            className="admin-form"
          >
            <h3>Manage Projects</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.projects.title || ""}
                onChange={(e) => handleInputChange(e, "projects")}
                placeholder="Project Title"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.projects.description || ""}
                onChange={(e) => handleInputChange(e, "projects")}
                placeholder="Project Description"
                required
              />
            </div>
            <div className="form-group">
              <label>Technologies (comma-separated)</label>
              <input
                type="text"
                name="technologies"
                value={formData.projects.technologies || ""}
                onChange={(e) => handleInputChange(e, "projects")}
                placeholder="e.g., React, Node.js, MongoDB"
                required
              />
            </div>
            <div className="form-group">
              <label>Project Image</label>
              <input
                type="file"
                ref={(el) => (fileInputRef.current.projects = el)}
                onChange={(e) => handleImageChange(e, "projects")}
                accept="image/*"
                required
                className="file-input"
              />
              {imagePreview.projects && (
                <div className="image-preview">
                  <img src={imagePreview.projects} alt="Preview" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>GitHub Link</label>
              <input
                type="url"
                name="githubLink"
                value={formData.projects.githubLink || ""}
                onChange={(e) => handleInputChange(e, "projects")}
                placeholder="GitHub Repository URL"
              />
            </div>
            <div className="form-group">
              <label>Live Link</label>
              <input
                type="url"
                name="liveLink"
                value={formData.projects.liveLink || ""}
                onChange={(e) => handleInputChange(e, "projects")}
                placeholder="Live Project URL"
              />
            </div>
            <button type="submit" className="submit-button">
              Add Project
            </button>
          </form>
        );

      case "achievements":
        return (
          <form
            onSubmit={(e) => handleSubmit(e, "achievements")}
            className="admin-form"
          >
            <h3>Manage Achievements</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.achievements.title || ""}
                onChange={(e) => handleInputChange(e, "achievements")}
                placeholder="Achievement Title"
                required
              />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                name="description"
                value={formData.achievements.description || ""}
                onChange={(e) => handleInputChange(e, "achievements")}
                placeholder="Achievement Description"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.achievements.category || ""}
                onChange={(e) => handleInputChange(e, "achievements")}
                required
              >
                <option value="">Select a category</option>
                {achievementCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date Type</label>
              <select
                name="date.type"
                value={formData.achievements.date.type || "single"}
                onChange={(e) => handleInputChange(e, "achievements")}
              >
                <option value="single">Single Date</option>
                <option value="period">Date Period</option>
              </select>
            </div>
            {formData.achievements.date.type === "single" ? (
              <div className="form-group">
                <label>Date (optional)</label>
                <input
                  type="date"
                  name="date.singleDate"
                  value={formData.achievements.date.singleDate || ""}
                  onChange={(e) => handleInputChange(e, "achievements")}
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="date.startDate"
                    value={formData.achievements.date.startDate || ""}
                    onChange={(e) => handleInputChange(e, "achievements")}
                    required={formData.achievements.date.type === "period"}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="date.endDate"
                    value={formData.achievements.date.endDate || ""}
                    onChange={(e) => handleInputChange(e, "achievements")}
                    required={formData.achievements.date.type === "period"}
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label>Achievement Image (optional)</label>
              <input
                type="file"
                ref={(el) => (fileInputRef.current.achievements = el)}
                onChange={(e) => handleImageChange(e, "achievements")}
                accept="image/*"
                className="file-input"
              />
              {imagePreview.achievements && (
                <div className="image-preview">
                  <img src={imagePreview.achievements} alt="Preview" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Link (optional)</label>
              <input
                type="url"
                name="link"
                value={formData.achievements.link || ""}
                onChange={(e) => handleInputChange(e, "achievements")}
                placeholder="Achievement Link URL"
              />
            </div>
            <button type="submit" className="submit-button">
              Add Achievement
            </button>
          </form>
        );

      case "experiences":
        return (
          <form
            onSubmit={(e) => handleSubmit(e, "experiences")}
            className="admin-form"
          >
            <h3>Manage Experience</h3>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.experiences.jobTitle || ""}
                onChange={(e) => handleInputChange(e, "experiences")}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={formData.experiences.company || ""}
                onChange={(e) => handleInputChange(e, "experiences")}
                placeholder="Company Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.experiences.description || ""}
                onChange={(e) => handleInputChange(e, "experiences")}
                placeholder="Job description and responsibilities"
                required
              />
            </div>
            <div className="form-group">
              <label>Location (optional)</label>
              <input
                type="text"
                name="location"
                value={formData.experiences.location || ""}
                onChange={(e) => handleInputChange(e, "experiences")}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div className="form-group">
              <label>Employment Type</label>
              <select
                name="employmentType"
                value={formData.experiences.employmentType || "Full-time"}
                onChange={(e) => handleInputChange(e, "experiences")}
                required
              >
                {employmentTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.experiences.startDate || ""}
                onChange={(e) => handleInputChange(e, "experiences")}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={formData.experiences.isCurrent}
                  onChange={(e) => handleInputChange(e, "experiences")}
                />
                Current Position
              </label>
            </div>
            {!formData.experiences.isCurrent && (
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.experiences.endDate || ""}
                  onChange={(e) => handleInputChange(e, "experiences")}
                  required={formData.experiences.isCurrent === false}
                />
              </div>
            )}
            <div className="form-group">
              <label>Technologies (comma-separated, optional)</label>
              <input
                type="text"
                name="technologies"
                value={formData.experiences.technologies || ""}
                onChange={(e) => handleInputChange(e, "experiences")}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
            <div className="form-group">
              <label>Key Achievements (comma-separated, optional)</label>
              <textarea
                name="achievements"
                value={formData.experiences.achievements || ""}
                onChange={(e) => handleInputChange(e, "experiences")}
                placeholder="e.g., Led team of 5 developers, Improved performance by 40%"
              />
            </div>
            <div className="form-group">
              <label>Company Logo (optional)</label>
              <input
                type="file"
                ref={(el) => (fileInputRef.current.experiences = el)}
                onChange={(e) => handleImageChange(e, "experiences")}
                accept="image/*"
                className="file-input"
              />
              {imagePreview.experiences && (
                <div className="image-preview">
                  <img src={imagePreview.experiences} alt="Preview" />
                </div>
              )}
            </div>
            <button type="submit" className="submit-button">
              Add Experience
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Admin Dashboard</h2>
          <div className="header-buttons">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            <button onClick={handleClose} className="close-button">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="tabs">
            <button
              className={`tab-button ${
                activeTab === "projects" ? "active" : ""
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              className={`tab-button ${
                activeTab === "achievements" ? "active" : ""
              }`}
              onClick={() => setActiveTab("achievements")}
            >
              Achievements
            </button>
            <button
              className={`tab-button ${
                activeTab === "experiences" ? "active" : ""
              }`}
              onClick={() => setActiveTab("experiences")}
            >
              Experiences
            </button>
          </div>

          <div className="form-container">
            {renderForm()}
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`status-message ${status.type}`}
              >
                {status.message}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
