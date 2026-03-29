"use client";

import { motion } from "framer-motion";

export default function SpecialAnimation() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="w-full max-w-xs mx-auto"
      aria-label="Special technique animation"
    >
      {/* Dohyo */}
      <ellipse cx="100" cy="128" rx="85" ry="8" fill="none" stroke="#D4A97A" strokeWidth="2" />

      {/* Starburst for "special" */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "100px 75px" }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="75"
            x2={100 + 28 * Math.cos((deg * Math.PI) / 180)}
            y2={75 + 28 * Math.sin((deg * Math.PI) / 180)}
            stroke="#C0292A"
            strokeWidth="2"
            opacity="0.3"
          />
        ))}
      </motion.g>

      {/* Left rikishi */}
      <ellipse cx="72" cy="88" rx="17" ry="22" fill="#1A1A1A" />
      <circle cx="72" cy="63" r="11" fill="#1A1A1A" />
      <rect x="57" y="96" width="28" height="6" rx="2" fill="#C0292A" />

      {/* Right rikishi */}
      <ellipse cx="128" cy="88" rx="17" ry="22" fill="#D4A97A" />
      <circle cx="128" cy="63" r="11" fill="#D4A97A" />
      <rect x="113" y="96" width="28" height="6" rx="2" fill="#8B1A1A" />

      {/* Question mark for "rare/special" */}
      <motion.text
        x="100"
        y="80"
        textAnchor="middle"
        fontSize="22"
        fontWeight="bold"
        fill="#C0292A"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ?
      </motion.text>
    </svg>
  );
}
