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
    <div className="flex flex-col items-center gap-4">
      <p className="text-[#52525B] text-xs uppercase tracking-[0.2em] font-medium">
        Next Basho
      </p>
      <p className="font-display font-bold text-[#FAFAFA] text-xl">
        {bashoName}{" "}
        <span className="text-[#A1A1AA] font-normal">· {bashoNameJp}</span>
      </p>
      <div className="flex items-end gap-5">
        {units.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <span className="font-mono font-bold text-4xl text-[#FAFAFA] tabular-nums leading-none">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#3F3F46] font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
