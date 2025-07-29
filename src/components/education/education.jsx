import React from "react";
import { motion } from "framer-motion";
import "./education.css";

const Education = () => {
  const educationData = [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "Rajiv Gandhi University of Knowledge Technologies",
      duration: "2022 - Ongoing",
      location: "Nuzvid, Andhra Pradesh",
      description:
        "Relevant coursework: Data Structures, Algorithms, Database Management Systems, Web Development, Software Engineering",
      achievements: [
        "Maintained a CGPA of 9 and above",
        "Participated in various technical events and hackathons",
      ],
    },
    {
      degree: "Intermediate Education (12th)",
      institution: "Rajiv Gandhi University of Knowledge Technologies",
      duration: "2020 - 2022",
      location: "Nuzvid, Andhra Pradesh",
      description: "Completed with a focus on Mathematics and Computer Science",
      achievements: [
        "Scored 9.77 Gpa in examinations",
        "Participated in science exhibitions",
      ],
    },
    {
      degree: "Secondary School Certificate (10th)",
      institution: "Sri Chaitanya Techno School",
      duration: "2019 - 2020",
      location: "Pithapuram, Andhra Pradesh",
      description: "Completed with distinction",
      achievements: [
        "Scored 10 Gpa in board examinations",
        "Participated in various extracurricular activities",
      ],
    },
  ];

  return (
    <section id="education" className="education-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Education
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="section-subtitle"
        >
          My academic journey and qualifications
        </motion.p>

        <div className="education-timeline">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="education-card"
            >
              <div className="education-content">
                <h3 className="degree">{edu.degree}</h3>
                <h4 className="institution">{edu.institution}</h4>
                <div className="education-details">
                  <span className="duration">{edu.duration}</span>
                  <span className="location">{edu.location}</span>
                </div>
                <p className="description">{edu.description}</p>
                <ul className="achievements-list">
                  {edu.achievements.map((achievement, idx) => (
                    <li key={idx} className="achievement-item">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
