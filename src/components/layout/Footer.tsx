import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#EDE0CC] mt-20 border-t-2 border-[#C0292A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#C0292A] text-xl font-black">相撲</span>
            <span className="font-bold text-[#FAF7F2]">Sumo Love</span>
          </div>
          <p className="text-sm text-[#D4A97A] leading-relaxed">
            The live tracker for Makuuchi and Sanyaku rikishi. Every basho,
            every bout.
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[#C0292A] mb-3">
            Navigate
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/rikishi" className="hover:text-white transition-colors">
                Rikishi
              </Link>
            </li>
            <li>
              <Link href="/basho" className="hover:text-white transition-colors">
                Basho
              </Link>
            </li>
            <li>
              <Link href="/kimarite" className="hover:text-white transition-colors">
                Kimarite
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[#C0292A] mb-3">
            Sources
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.sumo.or.jp/En/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Japan Sumo Association
              </a>
            </li>
            <li>
              <a
                href="https://sumo-api.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Sumo API
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[#D4A97A]">
        Fan-made tracker. Not affiliated with the Japan Sumo Association.
      </div>
    </footer>
  );
}
