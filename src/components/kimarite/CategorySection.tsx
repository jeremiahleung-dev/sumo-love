"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import KimariteCard from "./KimariteCard";

const INITIAL_COUNT = 5;

interface KimariteItem {
  id: string;
  nameEn: string;
  nameJp: string;
  category: string;
  description: string;
  usageCount: number;
}

export default function CategorySection({ items }: { items: KimariteItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, INITIAL_COUNT);
  const hidden = items.length - INITIAL_COUNT;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((k) => (
          <KimariteCard
            key={k.id}
            id={k.id}
            nameEn={k.nameEn}
            nameJp={k.nameJp}
            category={k.category}
            description={k.description}
            usageCount={k.usageCount}
          />
        ))}
      </div>
      {!expanded && hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-4 flex items-center gap-1.5 text-sm text-[#C0292A] font-medium hover:underline"
        >
          <ChevronDown size={14} />
          Show {hidden} more
        </button>
      )}
    </div>
  );
}
