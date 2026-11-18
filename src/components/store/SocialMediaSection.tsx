"use client";

import React from "react";
import {
  Facebook,
  Youtube,
  ExternalLink,
  ThumbsUp,
  MessageCircle,
  Share2,
  Play,
  CheckCircle,
  Users,
  Video,
  Bell,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function SocialMediaSection() {
  return (
    <section className="w-full space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brandYellow text-brandNavy font-black text-xs shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brandNavy" />
          <span>සමාජ මාධ්‍ය ජාලයන් සමඟ එක්වන්න • Social Communities</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-brandNavy tracking-tight">
          පදනම සමාජ මාධ්‍ය ජාලය (Connect with Us)
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          නවතම පොත් නිකුත් කිරීම්, විභාග ප්‍රශ්න පත්‍ර විවරණ, කෙටි සටහන් සහ නොමිලේ අධ්‍යාපනික වීඩියෝ පාඩම් සඳහා අපගේ නිල Facebook පිටුව සහ YouTube නාලිකාව සමඟ දැන්ම එක්වන්න.
        </p>
      </div>

      {/* 2-Column Grid: Left Facebook, Right YouTube */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* ================= LEFT COLUMN: FACEBOOK ================= */}
        <div className="bg-white rounded-3xl border-2 border-[#1877F2]/20 hover:border-[#1877F2]/50 shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          {/* Top Facebook Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#1877F2]" />

          <div className="space-y-6">
            {/* Header: Facebook Page Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#1877F2]/30">
                  <Facebook className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-brandNavy">
                      පදනම ප්‍රකාශන
                    </h3>
                    <CheckCircle className="w-4 h-4 text-[#1877F2] fill-[#1877F2] text-white" />
                  </div>
                  <p className="text-xs text-ink-muted font-medium">@padanama07 • නිල Facebook පිටුව</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-[#1877F2]">
                    <Users className="w-3.5 h-3.5" />
                    <span>45,000+ අනුගාමිකයින් (Followers)</span>
                  </div>
                </div>
              </div>

              <a
                href="https://www.facebook.com/padanama07/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#1565C0] text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105"
              >
                <span>Follow Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mock Live Facebook Post Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-brandYellow border border-brandNavy/20 p-1 flex items-center justify-center shrink-0">
                  <Logo size="sm" showText={false} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-brandNavy flex items-center gap-1">
                    <span>Padanama Publication - පදනම ප්‍රකාශන</span>
                    <CheckCircle className="w-3 h-3 text-[#1877F2] fill-[#1877F2] text-white inline" />
                  </h4>
                  <span className="text-[10px] text-ink-muted">පැය 2කට පෙර • 🌐 ප්‍රසිද්ධයි</span>
                </div>
              </div>

              <p className="text-xs text-ink leading-relaxed">
                📢 <strong>2026 වසර සඳහා නවතම 5 ශ්‍රේණිය ශිෂ්‍යත්ව ආදර්ශ ප්‍රශ්න පත්‍ර සහ සාමාන්‍ය පෙළ කෙටි සටහන් සංග්‍රහය දැන් නිකුත් වී ඇත!</strong>
                <br />
                විශේෂ 20% වට්ටම් සහ දිවයින පුරා Domex කුරියර් මඟින් නිවසටම ගෙන්වා ගැනීමේ (COD) පහසුකම සහිතයි. ඔබගේ පිටපත දැන්ම වෙන්කරවා ගන්න.
              </p>

              {/* Post Visual Banner Preview */}
              <div className="rounded-xl overflow-hidden border border-slate-200 relative aspect-[16/9] bg-gradient-to-tr from-brandNavy to-maroon-900 flex items-center justify-center">
                <img
                  src="https://www.padanamapublication.lk/image/others/shortnotes.jpg"
                  alt="Facebook Post Banner"
                  className="w-full h-full object-cover filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brandNavy/90 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold drop-shadow">
                    පදනම ප්‍රකාශන • නිල පොත් නාමාවලිය සහ වට්ටම් දීමනා
                  </span>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px]">👍</span>
                  <span className="font-bold text-brandNavy">1,420 දෙනෙක් කැමති වී ඇත</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>අදහස් 348</span>
                  <span>බෙදාගැනීම් 192</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-xs font-bold text-slate-700">
                <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>Like</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Comment</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>

          {/* Facebook Footer Link Button */}
          <div className="pt-6">
            <a
              href="https://www.facebook.com/padanama07/"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1877F2] hover:bg-[#1565C0] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
            >
              <Facebook className="w-4 h-4 fill-current" />
              <span>Facebook පිටුවට පිවිසෙන්න (Visit Facebook Page)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: YOUTUBE ================= */}
        <div className="bg-white rounded-3xl border-2 border-[#FF0000]/20 hover:border-[#FF0000]/50 shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          {/* Top YouTube Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF0000]" />

          <div className="space-y-6">
            {/* Header: YouTube Channel Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF0000]/30">
                  <Youtube className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-brandNavy">
                      පදනම YouTube නාලිකාව
                    </h3>
                    <CheckCircle className="w-4 h-4 text-slate-500 fill-slate-500 text-white" />
                  </div>
                  <p className="text-xs text-ink-muted font-medium">@padanamapublication • නිල නාලිකාව</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-[#FF0000]">
                    <Video className="w-3.5 h-3.5" />
                    <span>28,000+ ග්‍රාහකයින් (Subscribers) • 180+ වීඩියෝ</span>
                  </div>
                </div>
              </div>

              <a
                href="https://www.youtube.com/@padanamapublication"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF0000] hover:bg-[#CC0000] text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </a>
            </div>

            {/* Mock Live YouTube Video Preview Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3.5">
              {/* Featured Video Player Mock */}
              <div className="rounded-xl overflow-hidden relative aspect-[16/9] bg-black shadow-inner group/video cursor-pointer">
                <img
                  src="https://www.padanamapublication.lk/image/bg-images/mainslide3.jpg"
                  alt="YouTube Video Thumbnail"
                  className="w-full h-full object-cover filter brightness-[0.75] group-hover/video:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-xl group-hover/video:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                  28:45
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#FF0000] text-white font-bold text-[10px] flex items-center gap-1">
                  <span>නවතම සම්මන්ත්‍රණය</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display font-extrabold text-sm sm:text-base text-brandNavy hover:text-[#FF0000] transition-colors leading-snug">
                  5 ශ්‍රේණිය ශිෂ්‍යත්ව ආදර්ශ ප්‍රශ්න පත්‍ර විවරණය - විශේෂ දේශනය
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  පදනම ප්‍රකාශන මණ්ඩලයේ ප්‍රවීණ ආචාර්යවරුන් විසින් මෙහෙයවන ලද විභාග ඉලක්කගත ප්‍රශ්න පත්‍ර විවරණය.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-ink-muted pt-1">
                  <span className="font-bold text-brandNavy">නැරඹුම් වාර 54,000+</span>
                  <span>•</span>
                  <span>සති 2කට පෙර</span>
                </div>
              </div>

              {/* Secondary Playlist Mini Chips */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-extrabold text-brandNavy block">
                  නවතම අධ්‍යාපනික වීඩියෝ මාලාවන්:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <a
                    href="https://www.youtube.com/@padanamapublication"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#FF0000] text-brandNavy font-semibold flex items-center gap-2 truncate transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-[#FF0000] shrink-0" />
                    <span className="truncate">සාමාන්‍ය පෙළ ගණිතය කෙටි ක්‍රම</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@padanamapublication"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#FF0000] text-brandNavy font-semibold flex items-center gap-2 truncate transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-[#FF0000] shrink-0" />
                    <span className="truncate">උසස් පෙළ Biology Resource Book</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Footer Link Button */}
          <div className="pt-6">
            <a
              href="https://www.youtube.com/@padanamapublication"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#FF0000] hover:bg-[#CC0000] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>YouTube නාලිකාවට දායක වන්න (Subscribe on YouTube)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}