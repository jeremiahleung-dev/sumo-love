"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function YoutubeEmbed({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="relative w-full aspect-video rounded overflow-hidden bg-black group"
        aria-label={`Play ${title ?? "match highlight"}`}
      >
        {/* Thumbnail */}
        <Image
          src={thumb}
          alt={title ?? "Match highlight"}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {/* Play button */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="bg-[#C0292A] rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
            <Play size={24} fill="white" className="text-white ml-0.5" />
          </span>
        </span>
        {title && (
          <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3 text-white text-xs text-left truncate">
            {title}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="w-full aspect-video rounded overflow-hidden">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title ?? "Match highlight"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
