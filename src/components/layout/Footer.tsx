import Link from "next/link";

const NAV = [
  { href: "/rikishi", label: "Rikishi" },
  { href: "/basho", label: "Basho" },
  { href: "/kimarite", label: "Kimarite" },
];

const SOURCES = [
  { href: "https://www.sumo.or.jp/En/", label: "Japan Sumo Association" },
  { href: "https://sumo-api.com", label: "Sumo API" },
];

export default function Footer() {
  return (
    <footer className="bg-[#09090B] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="font-display font-bold text-[#FAFAFA] text-sm mb-3">
            Sumo Love
          </p>
          <p className="text-sm text-[#52525B] leading-relaxed max-w-xs">
            The live tracker for Makuuchi and Sanyaku rikishi.
            Every basho, every bout.
          </p>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#3F3F46] font-semibold mb-4">
            Navigate
          </h3>
          <ul className="space-y-2.5">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[#71717A] hover:text-[#FAFAFA] transition-colors duration-200 cursor-pointer"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#3F3F46] font-semibold mb-4">
            Sources
          </h3>
          <ul className="space-y-2.5">
            {SOURCES.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#71717A] hover:text-[#FAFAFA] transition-colors duration-200 cursor-pointer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.04] py-5 text-center text-xs text-[#3F3F46]">
        Fan-made tracker. Not affiliated with the Japan Sumo Association.
      </div>
    </footer>
  );
}
