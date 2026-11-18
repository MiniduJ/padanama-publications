import React from "react";
import { Play } from "lucide-react";
import { FacebookIcon, YouTubeIcon } from "@/components/ui/BrandIcons";

export interface SocialItem {
  id: string;
  kind: "POST" | "VIDEO";
  url: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
}

import { FACEBOOK_URL, YOUTUBE_URL } from "@/data/site-defaults";

function youtubeId(url: string) {
  return url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/)?.[1];
}

function thumb(item: SocialItem) {
  if (item.thumbnailUrl) return item.thumbnailUrl;
  const id = item.kind === "VIDEO" ? youtubeId(item.url) : undefined;
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "/favicon.png";
}

/** Edge-to-edge grid of posts and videos. Items managed in Admin → Social Feed; each tile opens the original post. */
export function SocialMediaSection({ items, title, subtitle }: { items: SocialItem[]; title: string; subtitle: string }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brandNavy tracking-tight">{title}</h2>
          <p className="text-sm text-ink-muted mt-1">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-extrabold">
            <FacebookIcon className="w-4 h-4" /> Facebook
          </a>
          <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF0000] text-white text-xs font-extrabold">
            <YouTubeIcon className="w-4 h-4" /> YouTube
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden">
        {items.map((it, i) => (
          <a
            key={it.id}
            href={it.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${it.kind === "VIDEO" ? "Watch video" : "View post"}: ${it.caption || ""}`.trim()}
            className={`group relative block overflow-hidden bg-brandNavy ${i === 0 ? "col-span-2 row-span-2" : ""} aspect-square`}
          >
            <img src={thumb(it)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            {it.kind === "VIDEO" ? (
              <span className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#FF0000]/90 text-white flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </span>
            ) : (
              <FacebookIcon className="absolute top-2 right-2 w-5 h-5 text-white drop-shadow" />
            )}
            {it.caption && <p className="absolute bottom-2 left-2 right-2 text-white text-[11px] sm:text-xs font-bold line-clamp-2">{it.caption}</p>}
          </a>
        ))}
      </div>
    </div>
  );
}
