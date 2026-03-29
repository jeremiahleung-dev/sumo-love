"use client";

import { motion } from "framer-motion";

export default function ThrowAnimation() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="w-full max-w-xs mx-auto"
      aria-label="Throw technique animation"
    >
      {/* Dohyo line */}
      <ellipse cx="100" cy="128" rx="85" ry="8" fill="none" stroke="#D4A97A" strokeWidth="2" />

      {/* Winner — rotates into throw */}
      <motion.g
        animate={{ rotate: [0, -15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, times: [0, 0.4, 0.6, 1] }}
        style={{ transformOrigin: "80px 85px" }}
      >
        <ellipse cx="80" cy="85" rx="17" ry="22" fill="#1A1A1A" />
        <circle cx="80" cy="60" r="11" fill="#1A1A1A" />
        <rect x="65" y="93" width="28" height="6" rx="2" fill="#C0292A" />
        {/* Gripping arm */}
        <motion.line
          x1="95" y1="78"
          x2="115" y2="72"
          stroke="#1A1A1A"
          strokeWidth="7"
          strokeLinecap="round"
          animate={{ x2: [115, 110], y2: [72, 68] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </motion.g>

      {/* Loser — flies through the air then lands */}
      <motion.g
        animate={{
          x: [0, 20, 35],
          y: [0, -20, 25],
          rotate: [0, 90, 160],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, times: [0, 0.45, 0.75] }}
        style={{ transformOrigin: "120px 85px" }}
      >
        <ellipse cx="120" cy="85" rx="16" ry="20" fill="#D4A97A" />
        <circle cx="120" cy="62" r="11" fill="#D4A97A" />
        <rect x="106" y="93" width="28" height="5" rx="2" fill="#8B1A1A" />
      </motion.g>
    </svg>
  );
}
