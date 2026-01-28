"use client";

import { useEffect, useState } from "react";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
};

export default function StarCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let sparkleId = 0;
    const colors = ["#4C9AFF", "#FF3333", "#FFE735", "#F594FE"];

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Create sparkle trail
      const newSparkle: Sparkle = {
        id: sparkleId++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      };

      setSparkles((prev) => [...prev, newSparkle]);

      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Main Star Cursor */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Outer glow */}
        <div className="absolute inset-0 -m-4">
          <svg width="40" height="40" viewBox="0 0 40 40" className="animate-pulse">
            <defs>
              <radialGradient id="glow">
                <stop offset="0%" stopColor="#4C9AFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FFE735" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="20" fill="url(#glow)" />
          </svg>
        </div>

        {/* Main star */}
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          className="animate-spin-slow drop-shadow-[0_0_8px_rgba(255,231,53,0.8)]"
          style={{ animationDuration: "3s" }}
        >
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE735" />
              <stop offset="50%" stopColor="#FF3333" />
              <stop offset="100%" stopColor="#4C9AFF" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="url(#starGradient)"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Sparkle Trail */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="fixed pointer-events-none z-[9998] animate-sparkle"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            transform: `translate(-50%, -50%) rotate(${sparkle.rotation}deg)`,
          }}
        >
          <svg
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 24 24"
            style={{
              filter: `drop-shadow(0 0 4px ${sparkle.color})`,
            }}
          >
            <path
              d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
              fill={sparkle.color}
              opacity="0.9"
            />
          </svg>
        </div>
      ))}
    </>
  );
}
