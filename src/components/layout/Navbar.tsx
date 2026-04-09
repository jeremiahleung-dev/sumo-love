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
    <header className="sticky top-0 z-50 bg-[#09090B]/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-[15px] tracking-tight text-[#FAFAFA] hover:text-[#DC2626] transition-colors duration-200 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          Sumo Love
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  active
                    ? "text-[#FAFAFA] bg-[#27272A]"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#18181B] transition-colors duration-200 cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-white/[0.06] px-4 py-3 flex flex-col gap-0.5 bg-[#09090B]">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                pathname.startsWith(href)
                  ? "text-[#FAFAFA] bg-[#27272A]"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]"
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
