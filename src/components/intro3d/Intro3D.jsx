import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  ContactShadows,
} from "@react-three/drei";
import Particles from "../particles/Particles";
import Hyperspeed from "../hyperSpeed/Hyperspeed";

// Robot Model
const Model = () => {
  const gltf = useGLTF("/bluerobo.glb");
  const isMobile = window.innerWidth <= 768;

  return (
    <primitive
      object={gltf.scene}
      scale={isMobile ? [0.8, 0.8, 0.8] : [1.1, 1.1, 1.1]}
      position={[0, -0.2, 0]}
    />
  );
};

// Preload the model for performance
// useGLTF.preload("/bluerobo.glb", true);

const Intro3D = ({ onTransitionComplete }) => {
  const [showHyperspeed, setShowHyperspeed] = useState(false);
  const [hyperspeedOpacity, setHyperspeedOpacity] = useState(0);

  const handleViewWork = () => {
    setShowHyperspeed(true);
    // Fade in the hyperspeed effect
    setTimeout(() => {
      setHyperspeedOpacity(1);
    }, 50);
  };

  // Effect to handle transition completion after 1.5 seconds
  useEffect(() => {
    if (showHyperspeed) {
      const timer = setTimeout(() => {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showHyperspeed, onTransitionComplete]);

  return (
    <div
      className="canvas-wrapper"
      style={{ width: "100vw", height: "100vh", position: "relative" }}
    >
      {/* 🔥 Particle Background - only show when not Hyperspeed */}
      {!showHyperspeed && (
        <div className="particles-bg">
          <Particles
            particleColors={["#FFD700", "#FFD700"]}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
      )}

      {/* 3D Canvas Layer or Hyperspeed */}
      <div
        className="canvas-container"
        style={{ width: "100vw", height: "100vh", position: "relative" }}
      >
        {showHyperspeed ? (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 9999,
              opacity: hyperspeedOpacity,
              transition: "opacity 0.5s ease-in-out",
              backgroundColor: "#000000", // Add black background to ensure visibility
            }}
          >
            <Hyperspeed
              effectOptions={{
                onSpeedUp: () => {},
                onSlowDown: () => {},
                distortion: "turbulentDistortion",
                length: 400,
                roadWidth: 25,
                islandWidth: 2,
                lanesPerRoad: 4,
                fov: 90,
                fovSpeedUp: 150,
                speedUp: 2,
                carLightsFade: 0.4,
                totalSideLightSticks: 20,
                lightPairsPerRoadWay: 40,
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,
                lightStickWidth: [0.12, 0.5],
                lightStickHeight: [1.3, 1.7],
                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],
                carLightsLength: [400 * 0.03, 400 * 0.2],
                carLightsRadius: [0.05, 0.14],
                carWidthPercentage: [0.3, 0.5],
                carShiftX: [-0.8, 0.8],
                carFloorSeparation: [0, 5],
                colors: {
                  roadColor: 0x080808,
                  islandColor: 0x0a0a0a,
                  background: 0x000000,
                  shoulderLines: 0xffffff,
                  brokenLines: 0xffffff,
                  leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                  rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                  sticks: 0x03b3c3,
                },
              }}
            />
          </div>
        ) : (
          <>
            {/* Instructions text at the top */}
            <div
              style={{
                position: "absolute",
                top: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                color: "#FFD700",
                fontSize: "1.2rem",
                fontWeight: "600",
                textAlign: "center",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              Move around to play with robo
            </div>

            <Canvas
              camera={{ position: [0, 0, 3], fov: 45 }}
              shadows
              gl={{ alpha: true }}
              style={{
                background: "transparent",
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            >
              <ambientLight intensity={0.4} color="#FFC300" />
              <pointLight position={[-2, 4, 3]} intensity={1} color="#90CAF9" />
              <spotLight
                position={[3, 5, 2]}
                angle={0.6}
                intensity={1.5}
                color="#FFD700"
                penumbra={0.7}
                castShadow
              />
              <spotLight
                position={[-3, 4, -2]}
                angle={0.5}
                intensity={1.2}
                color="#FFB300"
                penumbra={0.5}
              />
              <Environment preset="sunset" background={false} />
              <Model />
              <ContactShadows
                position={
                  window.innerWidth <= 768 ? [0, -0.6, 0] : [0, -0.8, 0]
                }
                opacity={0.7}
                scale={window.innerWidth <= 768 ? 3.2 : 4}
                blur={2.2}
                far={4}
                color={window.innerWidth <= 768 ? "#FFA000" : "#FFD54F"}
              />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                maxPolarAngle={Math.PI / 1.6}
                minPolarAngle={0.4}
                enableDamping
              />
            </Canvas>
            <div
              className="view-work-button-wrapper"
              style={{
                position: "absolute",
                left: "50%",
                bottom: "3rem",
                transform: "translateX(-50%)",
                zIndex: 9999,
                pointerEvents: "auto",
              }}
            >
              <button
                className="view-work-button"
                onClick={handleViewWork}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  backgroundColor: "transparent",
                  color: "#FFD700",
                  border: "2px solid #FFD700",
                  borderRadius: "2rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  zIndex: 9999,
                  pointerEvents: "auto",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FFD700";
                  e.target.style.color = "#000";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#FFD700";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Let's dive in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Intro3D;
