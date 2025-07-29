import React from "react";
import { motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaBootstrap,
  FaSass,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiRedux,
  SiNextdotjs,
  SiPostman,
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import "./skills.css";

const skillsData = [
  {
    category: "Frontend",
    skills: [
      { name: "HTML5", icon: FaHtml5, color: "#E44D26" },
      { name: "CSS3", icon: FaCss3Alt, color: "#264DE4" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      // { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "React", icon: FaReact, color: "#61DAFB" },
      // { name: "Redux", icon: SiRedux, color: "#764ABC" },
      // { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Bootstrap", icon: FaBootstrap, color: "#7952B3" },
      // { name: "Sass", icon: FaSass, color: "#CC6699" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", icon: FaNodeJs, color: "#339933" },
      { name: "Express.js", icon: SiExpress, color: "#000000" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", icon: FaGitAlt, color: "#F05032" },
      { name: "GitHub", icon: FaGithub, color: "#181717" },
      { name: "VS Code", icon: TbBrandVscode, color: "#007ACC" },
      // { name: "Postman", icon: SiPostman, color: "#FF6C37" },
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Skills
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="section-subtitle"
        >
          My technical expertise and capabilities
        </motion.p>

        <div className="skills-container">
          {skillsData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
              className="skill-category"
            >
              <h3 className="category-title">{category.category}</h3>
              <div className="skills-grid">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: skillIndex * 0.1 }}
                    className="skill-card"
                  >
                    <div className="skill-icon" style={{ color: skill.color }}>
                      {React.createElement(skill.icon, { size: 32 })}
                    </div>
                    <h4 className="skill-name">{skill.name}</h4>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
