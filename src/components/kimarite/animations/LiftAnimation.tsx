"use client";

import { motion } from "framer-motion";

export default function LiftAnimation() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="w-full max-w-xs mx-auto"
      aria-label="Lift technique animation"
    >
      {/* Dohyo */}
      <ellipse cx="100" cy="138" rx="85" ry="8" fill="none" stroke="#D4A97A" strokeWidth="2" />

      {/* Winner — bends knees then straightens to lift */}
      <motion.g
        animate={{ y: [0, 6, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8, times: [0, 0.25, 0.6, 1] }}
      >
        <ellipse cx="78" cy="90" rx="18" ry="23" fill="#1A1A1A" />
        <circle cx="78" cy="63" r="12" fill="#1A1A1A" />
        <rect x="63" y="99" width="30" height="6" rx="2" fill="#C0292A" />
        {/* Arms under belt for lift */}
        <line x1="93" y1="92" x2="108" y2="95" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round" />
        <line x1="93" y1="106" x2="108" y2="103" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round" />
      </motion.g>

      {/* Loser — gets lifted off ground */}
      <motion.g
        animate={{ y: [0, 0, -18, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8, times: [0, 0.25, 0.6, 1] }}
      >
        <ellipse cx="122" cy="88" rx="16" ry="20" fill="#D4A97A" />
        <circle cx="122" cy="65" r="11" fill="#D4A97A" />
        <rect x="108" y="96" width="28" height="5" rx="2" fill="#8B1A1A" />
        {/* Feet dangling */}
        <motion.line
          x1="114" y1="114"
          x2="110" y2="126"
          stroke="#D4A97A"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ x2: [110, 106], y2: [126, 122] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8 }}
        />
        <motion.line
          x1="126" y1="114"
          x2="130" y2="126"
          stroke="#D4A97A"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ x2: [130, 134], y2: [126, 122] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8 }}
        />
      </motion.g>
    </svg>
  );
}
