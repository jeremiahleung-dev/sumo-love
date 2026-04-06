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

export default function NextBashoCountdown({ targetDate, bashoName, bashoNameJp }: Props) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-white/40 text-xs uppercase tracking-widest">Next Basho</p>
      <p className="font-display font-bold text-white text-xl">
        {bashoName} <span className="text-[#D4A97A]">· {bashoNameJp}</span>
      </p>
      <div className="flex items-end gap-3">
        {units.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="font-mono font-bold text-3xl text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/30">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
