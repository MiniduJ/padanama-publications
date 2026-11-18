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

function Tile({ it }: { it: SocialItem }) {
  return (
    <a
      href={it.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${it.kind === "VIDEO" ? "Watch video" : "View post"}: ${it.caption || ""}`.trim()}
      className="group relative block overflow-hidden bg-brandNavy aspect-square"
    >
      <img src={thumb(it)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      {it.kind === "VIDEO" && (
        <span className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#FF0000]/90 text-white flex items-center justify-center shadow-lg">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </span>
      )}
      {it.caption && <p className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold line-clamp-2">{it.caption}</p>}
    </a>
  );
}

function Channel({ name, href, color, icon, cta, items }: { name: string; href: string; color: string; icon: React.ReactNode; cta: string; items: SocialItem[] }) {
  return (
    <article className="bg-white rounded-3xl border border-maroon-100 shadow-sm overflow-hidden flex flex-col">
      <header className="flex items-center justify-between gap-3 px-5 py-4 text-white" style={{ backgroundColor: color }}>
        <span className="flex items-center gap-2 font-extrabold">{icon} {name}</span>
        <a href={href} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-extrabold">{cta}</a>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-1 flex-1">
        {items.slice(0, 6).map((it) => <Tile key={it.id} it={it} />)}
      </div>
    </article>
  );
}

/** Facebook and YouTube as two cards in one section. Items managed in Admin → Social Feed; each tile opens the original post. */
export function SocialMediaSection({ items, title, subtitle }: { items: SocialItem[]; title: string; subtitle: string }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brandNavy tracking-tight">{title}</h2>
        <p className="text-sm text-ink-muted mt-1">{subtitle}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Channel name="Facebook" href={FACEBOOK_URL} color="#1877F2" icon={<FacebookIcon className="w-5 h-5" />} cta="Follow" items={items.filter((i) => i.kind === "POST")} />
        <Channel name="YouTube" href={YOUTUBE_URL} color="#FF0000" icon={<YouTubeIcon className="w-5 h-5" />} cta="Subscribe" items={items.filter((i) => i.kind === "VIDEO")} />
      </div>
    </div>
  );
}
