"use client";

import { motion } from "framer-motion";

export default function TripAnimation() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="w-full max-w-xs mx-auto"
      aria-label="Trip technique animation"
    >
      {/* Dohyo */}
      <ellipse cx="100" cy="128" rx="85" ry="8" fill="none" stroke="#D4A97A" strokeWidth="2" />

      {/* Winner */}
      <g>
        <ellipse cx="78" cy="85" rx="17" ry="22" fill="#1A1A1A" />
        <circle cx="78" cy="60" r="11" fill="#1A1A1A" />
        <rect x="63" y="93" width="28" height="6" rx="2" fill="#C0292A" />
        {/* Hooking leg */}
        <motion.line
          x1="90" y1="107"
          x2="108" y2="112"
          stroke="#1A1A1A"
          strokeWidth="7"
          strokeLinecap="round"
          animate={{ x2: [108, 115, 108], y2: [112, 108, 112] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
        />
      </g>

      {/* Loser — tips over from leg trip */}
      <motion.g
        animate={{ rotate: [0, 0, 75], x: [0, 0, 10], y: [0, 0, 8] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.4, 0.85] }}
        style={{ transformOrigin: "122px 107px" }}
      >
        <ellipse cx="122" cy="82" rx="16" ry="20" fill="#D4A97A" />
        <circle cx="122" cy="59" r="11" fill="#D4A97A" />
        <rect x="108" y="90" width="28" height="5" rx="2" fill="#8B1A1A" />
        {/* Leg being hooked */}
        <line x1="112" y1="107" x2="100" y2="113" stroke="#D4A97A" strokeWidth="7" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}
