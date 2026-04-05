import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-[#C0292A] text-xl font-black">相撲</span>
            <span className="font-display font-bold text-white">Sumo Love</span>
          </div>
          <p className="text-sm text-white/30 leading-relaxed">
            The live tracker for Makuuchi and Sanyaku rikishi. Every basho,
            every bout.
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-white/20 mb-4">
            Navigate
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/rikishi", label: "Rikishi" },
              { href: "/basho", label: "Basho" },
              { href: "/kimarite", label: "Kimarite" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-white/40 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-white/20 mb-4">
            Sources
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href="https://www.sumo.or.jp/En/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
              >
                Japan Sumo Association
              </a>
            </li>
            <li>
              <a
                href="https://sumo-api.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
              >
                Sumo API
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/15">
        Fan-made tracker. Not affiliated with the Japan Sumo Association.
      </div>
    </footer>
  );
}
