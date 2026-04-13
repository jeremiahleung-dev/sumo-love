"use client";

import { useState, useEffect } from "react";

interface Props {
  targetDate: string;
  bashoName: string;
  bashoNameJp: string;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function CountdownBanner({ targetDate, bashoName, bashoNameJp }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(new Date(targetDate)));

  useEffect(() => {
    const target = new Date(targetDate);
    const timer = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const units = [
    { label: "D", value: timeLeft.days },
    { label: "H", value: timeLeft.hours },
    { label: "M", value: timeLeft.minutes },
    { label: "S", value: timeLeft.seconds },
  ];

  return (
    <div className="bg-[#18181B] border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-[#DC2626] text-[10px] font-semibold tracking-[0.22em] uppercase">
            Next Basho
          </span>
          <span className="text-[#3F3F46] hidden sm:inline">·</span>
          <span className="text-[#FAFAFA] font-semibold text-sm">{bashoName}</span>
          <span className="text-[#52525B] text-sm">{bashoNameJp}</span>
        </div>
        <div className="flex items-center gap-4">
          {units.map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-1">
              <span className="font-mono font-bold text-lg text-[#FAFAFA] tabular-nums leading-none">
                {String(value).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase text-[#52525B] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
