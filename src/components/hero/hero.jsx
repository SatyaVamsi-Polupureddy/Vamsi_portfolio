import React, { useEffect, useRef } from "react";
import "./hero.css";
import { TbDownload } from "react-icons/tb";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroBg from "../../assets/images/hero-bg.png";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      // Animate hero content on load
      const tl = gsap.timeline();

      tl.fromTo(
        ".hello",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
        .fromTo(
          ".introName",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ".introPara",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ".button-container",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );

      // Parallax effect for hero image
      gsap.to(".hero-image", {
        y: -50,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Button hover animations
      const buttons = document.querySelectorAll('.resumeDownload, .hireMeButton');
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
        
        button.addEventListener('mousedown', () => {
          gsap.to(button, { scale: 0.95, duration: 0.1 });
        });
        
        button.addEventListener('mouseup', () => {
          gsap.to(button, { scale: 1.05, duration: 0.1 });
        });
      });
    }
  }, []);

  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Satya_Vamsi_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="intro" className="hero-section" ref={heroRef}>
      <div className="hero-content">
        <div className="introContent">
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
            <button className="resumeDownload" onClick={handleResumeDownload}>
              Resume
              <TbDownload className="download-icon" size={20} />
            </button>
            <a
              href={import.meta.env.VITE_EMAIL_LINK}
              target="_blank"
              className="hireMeButton"
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroBg} alt="Background" className="bg" />
      </div>
    </section>
  );
};

export default Hero;
