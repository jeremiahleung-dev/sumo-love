"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/rikishi", label: "Rikishi" },
  { href: "/basho", label: "Basho" },
  { href: "/kimarite", label: "Kimarite" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setOpen(false)}
        >
          <span className="text-[#C0292A] text-2xl font-black leading-none select-none">
            相撲
          </span>
          <span className="font-display font-bold text-base text-white tracking-tight group-hover:text-[#C0292A] transition-colors duration-200">
            Sumo Love
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#C0292A] text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1 bg-[#0A0A0A]">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "bg-[#C0292A] text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
