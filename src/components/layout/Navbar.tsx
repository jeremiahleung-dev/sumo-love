"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { Menu, X, Heart } from "lucide-react";
import KimariteSubNav from "./KimariteSubNav";
import NavFavoriteBadge from "./NavFavoriteBadge";

const NAV_LINKS = [
  { href: "/rikishi", label: "Rikishi" },
  { href: "/basho", label: "Basho" },
  { href: "/kimarite", label: "Kimarite" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const myRikishiActive = pathname.startsWith("/my-rikishi");

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

          {/* My Rikishi */}
          <Link
            href="/my-rikishi"
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              myRikishiActive
                ? "bg-[#C0292A] text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Heart size={13} className="mr-1.5" />
            My Rikishi
            {!myRikishiActive && (
              <Suspense fallback={null}>
                <NavFavoriteBadge />
              </Suspense>
            )}
          </Link>
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

      {/* Mobile menu — animated slide */}
      <nav
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#0A0A0A] ${
          open ? "max-h-64 border-t border-white/5" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
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
          <Link
            href="/my-rikishi"
            onClick={() => setOpen(false)}
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              myRikishiActive
                ? "bg-[#C0292A] text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Heart size={13} className="mr-1.5" />
            My Rikishi
            {!myRikishiActive && (
              <Suspense fallback={null}>
                <NavFavoriteBadge />
              </Suspense>
            )}
          </Link>
        </div>
      </nav>

      {/* Kimarite category sub-nav */}
      {pathname.startsWith("/kimarite") && (
        <Suspense fallback={null}>
          <KimariteSubNav />
        </Suspense>
      )}
    </header>
  );
}
