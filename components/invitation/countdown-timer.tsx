"use client";

import React, { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string | Date;
}

export function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const destination = new Date(targetDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Hari", val: timeLeft.days },
    { label: "Jam", val: timeLeft.hours },
    { label: "Menit", val: timeLeft.minutes },
    { label: "Detik", val: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#C5A059]/20 text-center shadow-md shadow-[#C5A059]/5"
        >
          <span className="block text-2xl sm:text-3xl font-bold font-mono text-[#8C6A28]">
            {String(unit.val).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider block mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
