"use client";

import { motion } from "framer-motion";

export default function PushAnimation() {
  return (
    <svg
      viewBox="0 0 200 120"
      className="w-full max-w-xs mx-auto"
      aria-label="Push technique animation"
    >
      {/* Dohyo line */}
      <ellipse cx="100" cy="105" rx="85" ry="10" fill="none" stroke="#D4A97A" strokeWidth="2" />

      {/* Winner (left rikishi) — pushes forward */}
      <motion.g
        initial={{ x: -10 }}
        animate={{ x: [0, 12, 12] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8, times: [0, 0.5, 1] }}
      >
        {/* Body */}
        <ellipse cx="72" cy="82" rx="18" ry="22" fill="#1A1A1A" />
        {/* Head */}
        <circle cx="72" cy="56" r="12" fill="#1A1A1A" />
        {/* Arms forward */}
        <line x1="86" y1="76" x2="102" y2="80" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
        <line x1="86" y1="90" x2="102" y2="88" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
        {/* Belt */}
        <rect x="57" y="90" width="30" height="6" rx="2" fill="#C0292A" />
      </motion.g>

      {/* Loser (right rikishi) — gets pushed back */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, 18, 18] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8, times: [0, 0.5, 1] }}
      >
        {/* Body */}
        <ellipse cx="128" cy="82" rx="18" ry="22" fill="#D4A97A" />
        {/* Head */}
        <circle cx="128" cy="56" r="12" fill="#D4A97A" />
        {/* Arms back */}
        <line x1="112" y1="76" x2="100" y2="79" stroke="#D4A97A" strokeWidth="6" strokeLinecap="round" />
        <line x1="112" y1="90" x2="100" y2="87" stroke="#D4A97A" strokeWidth="6" strokeLinecap="round" />
        {/* Belt */}
        <rect x="113" y="90" width="30" height="6" rx="2" fill="#8B1A1A" />
      </motion.g>
    </svg>
  );
}
