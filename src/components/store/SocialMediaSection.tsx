"use client";

import React, { useState } from "react";
import {
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
import { FacebookIcon, YouTubeIcon } from "@/components/ui/BrandIcons";
import { Logo } from "@/components/ui/Logo";

const FACEBOOK_POSTS = [
  {
    id: 1,
    time: "පැය 2කට පෙර",
    content:
      "📢 2026 වසර සඳහා නවතම 5 ශ්‍රේණිය ශිෂ්‍යත්ව ආදර්ශ ප්‍රශ්න පත්‍ර සහ සාමාන්‍ය පෙළ කෙටි සටහන් සංග්‍රහය දැන් නිකුත් වී ඇත! විශේෂ 20% වට්ටම් සහ දිවයින පුරා Domex කුරියර් මඟින් නිවසටම ගෙන්වා ගැනීමේ (COD) පහසුකම සහිතයි.",
    image: "https://www.padanamapublication.lk/image/others/shortnotes.jpg",
    label: "පදනම ප්‍රකාශන • නිල පොත් නාමාවලිය සහ වට්ටම් දීමනා",
    likes: "1,420",
    comments: "348",
    shares: "192",
    link: "https://www.facebook.com/padanama07/",
  },
  {
    id: 2,
    time: "ඊයේ ප.ව. 4:15",
    content:
      "🎉 Colombo International Book Fair (CIBF) BMICH ප්‍රදර්ශන කුටියෙන් පොත් මිලදී ගත් සියලුම දූ දරුවන්ට සහ දෙමාපියන්ට අපගේ හෘදයාංගම ස්තූතිය! අපගේ අන්තර්ජාල වෙබ් අඩවියෙන් ඇණවුම් කරන ඔබටත් නොමිලේ බෙදාහැරීම් සහ විශේෂ වට්ටම් හිමිවේ.",
    image: "https://www.padanamapublication.lk/image/bg-images/mainslide1.jpg",
    label: "කොළඹ ජාත්‍යන්තර පොත් ප්‍රදර්ශනය • පදනම ප්‍රකාශන කුටිය",
    likes: "2,150",
    comments: "412",
    shares: "320",
    link: "https://www.facebook.com/padanama07/",
  },
  {
    id: 3,
    time: "දින 3කට පෙර",
    content:
      "📚 උසස් පෙළ (A/L) විභාගය සඳහා භෞතික විද්‍යාව, රසායන විද්‍යාව සහ ජීව විද්‍යාව විෂයයන්හි පසුගිය විභාග බහුවරණ ප්‍රශ්න පත්‍ර විවරණ ග්‍රන්ථ දැන් සූදානම්! ලකුණු 75+ ඉලක්ක කරන සිසුන් සඳහා විශේෂයි.",
    image: "https://www.padanamapublication.lk/image/others/pastpapers.jpg",
    label: "උසස් පෙළ විභාග ඉලක්කගත පසුගිය ප්‍රශ්න පත්‍ර විවරණ",
    likes: "980",
    comments: "185",
    shares: "140",
    link: "https://www.facebook.com/padanama07/",
  },
  {
    id: 4,
    time: "සතියකට පෙර",
    content:
      "✍️ සාමාන්‍ය පෙළ ගණිතය සහ විද්‍යාව සිද්ධාන්ත කෙටි සටහන් පොත් කට්ටලය දැන් අමතර 15%ක වට්ටමක් සහිතව ඇණවුම් කළ හැක. දිවයිනේ ඕනෑම ප්‍රදේශයකට දින 2-3කින් කුරියර් මඟින් නිවසටම ලබාගත හැක.",
    image: "https://www.padanamapublication.lk/image/bg-images/mainslide2.jpg",
    label: "O/L කෙටි සටහන් කට්ටලය • විශේෂ වට්ටම් දීමනාව",
    likes: "1,840",
    comments: "290",
    shares: "215",
    link: "https://www.facebook.com/padanama07/",
  },
];

const YOUTUBE_VIDEOS = [
  {
    id: 1,
    title: "5 ශ්‍රේණිය ශිෂ්‍යත්ව ආදර්ශ ප්‍රශ්න පත්‍ර විවරණය - විශේෂ දේශනය",
    desc: "පදනම ප්‍රකාශන මණ්ඩලයේ ප්‍රවීණ ආචාර්යවරුන් විසින් මෙහෙයවන ලද විභාග ඉලක්කගත ප්‍රශ්න පත්‍ර විවරණය.",
    duration: "28:45",
    views: "54,000+",
    time: "සති 2කට පෙර",
    thumbnail: "https://www.padanamapublication.lk/image/bg-images/mainslide3.jpg",
    badge: "නවතම සම්මන්ත්‍රණය",
    link: "https://www.youtube.com/@padanamapublication",
  },
  {
    id: 2,
    title: "සාමාන්‍ය පෙළ (O/L) ගණිතය අනුමාන ප්‍රශ්න පත්‍ර සාකච්ඡාව - 1 කොටස",
    desc: "A සාමාර්ථයක් සඳහා විභාග ප්‍රශ්න වලට කෙටි ක්‍රම මඟින් නිවැරදිව පිළිතුරු ලියන ආකාරය පැහැදිලි කෙරේ.",
    duration: "42:10",
    views: "78,000+",
    time: "සති 3කට පෙර",
    thumbnail: "https://www.padanamapublication.lk/image/bg-images/mainslide1.jpg",
    badge: "O/L විශේෂ සාකච්ඡාව",
    link: "https://www.youtube.com/@padanamapublication",
  },
  {
    id: 3,
    title: "උසස් පෙළ ජීව විද්‍යාව - වැදගත්ම රූප සටහන් සහ මතක තබාගැනීමේ කෙටි ක්‍රම",
    desc: "ජීව විද්‍යාව විෂය නිර්දේශයේ සම්පත් පොත ඇසුරෙන් සැකසූ විශේෂිත මතක ආධාරක සහ කෙටි සටහන් අධ්‍යයනය.",
    duration: "35:20",
    views: "61,000+",
    time: "මසකට පෙර",
    thumbnail: "https://www.padanamapublication.lk/image/others/shortnotes.jpg",
    badge: "A/L විද්‍යා පාඩම් මාලාව",
    link: "https://www.youtube.com/@padanamapublication",
  },
  {
    id: 4,
    title: "ශිෂ්‍යත්ව දරුවන්ට පරිසරය සහ අංක ගණිත ගැටළු පහසුවෙන් විසඳන උපක්‍රම",
    desc: "ප්‍රශ්න පත්‍ර වලදී කාලය කළමනාකරණය කරගනිමින් නිවැරදිව තර්ක කර පිළිතුරු ලබාගැනීමේ රහස්.",
    duration: "19:15",
    views: "92,000+",
    time: "මසකට පෙර",
    thumbnail: "https://www.padanamapublication.lk/image/bg-images/mainslide2.jpg",
    badge: "ශිෂ්‍යත්ව කෙටි ක්‍රම",
    link: "https://www.youtube.com/@padanamapublication",
  },
];

export function SocialMediaSection() {
  const [selectedFbIndex, setSelectedFbIndex] = useState(0);
  const [selectedYtIndex, setSelectedYtIndex] = useState(0);

  const currentFb = FACEBOOK_POSTS[selectedFbIndex];
  const currentYt = YOUTUBE_VIDEOS[selectedYtIndex];

  return (
    <section className="w-full space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brandYellow text-brandNavy font-black text-xs shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brandNavy" />
          <span>CONNECT ON SOCIAL MEDIA • OFFICIAL CHANNELS</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-brandNavy tracking-tight">
          Connect With Us on Social Media
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          Follow our official Facebook page and YouTube channel for the latest book releases, model papers, past paper revisions, and free educational lessons.
        </p>
      </div>

      {/* 2-Column Grid: Left Facebook, Right YouTube */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* ================= LEFT COLUMN: FACEBOOK (4 POSTS) ================= */}
        <div className="bg-white rounded-3xl border-2 border-[#1877F2]/20 hover:border-[#1877F2]/50 shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          {/* Top Facebook Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#1877F2]" />

          <div className="space-y-6">
            {/* Header: Facebook Page Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#1877F2]/30">
                  <FacebookIcon className="w-8 h-8 fill-current shrink-0" size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-brandNavy">
                      Padanama Publication
                    </h3>
                    <CheckCircle className="w-4 h-4 text-[#1877F2] fill-[#1877F2] text-white" />
                  </div>
                  <p className="text-xs text-ink-muted font-medium">@padanama07 • Official Facebook Page</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-[#1877F2]">
                    <Users className="w-3.5 h-3.5" />
                    <span>45,000+ Followers</span>
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

            {/* 4-Post Switcher Tabs */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-brandNavy block">
                Select from 4 Recent Posts:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {FACEBOOK_POSTS.map((post, idx) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedFbIndex(idx)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedFbIndex === idx
                        ? "border-[#1877F2] bg-[#1877F2]/10 font-black text-[#1877F2] shadow-sm scale-102"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-semibold"
                    }`}
                  >
                    <span className="text-[11px] block truncate">Post {idx + 1}</span>
                    <span className="text-[9px] text-ink-muted block truncate">{post.time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Facebook Post Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-brandYellow border border-brandNavy/20 p-1 flex items-center justify-center shrink-0">
                  <Logo size="sm" showText={false} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-brandNavy flex items-center gap-1">
                    <span>Padanama Publication - පදනම ප්‍රකාශන</span>
                    <CheckCircle className="w-3 h-3 text-[#1877F2] fill-[#1877F2] text-white inline" />
                  </h4>
                  <span className="text-[10px] text-ink-muted">{currentFb.time} • 🌐 ප්‍රසිද්ධයි</span>
                </div>
              </div>

              <p className="text-xs text-ink leading-relaxed">
                {currentFb.content}
              </p>

              {/* Post Visual Banner Preview */}
              <div className="rounded-xl overflow-hidden border border-slate-200 relative aspect-[16/9] bg-gradient-to-tr from-brandNavy to-maroon-900 flex items-center justify-center">
                <img
                  src={currentFb.image}
                  alt={currentFb.label}
                  className="w-full h-full object-cover filter brightness-[0.88]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brandNavy/90 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold drop-shadow">
                    {currentFb.label}
                  </span>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px]">👍</span>
                  <span className="font-bold text-brandNavy">{currentFb.likes} දෙනෙක් කැමති වී ඇත</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>අදහස් {currentFb.comments}</span>
                  <span>බෙදාගැනීම් {currentFb.shares}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-xs font-bold text-slate-700">
                <a
                  href={currentFb.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>Like</span>
                </a>
                <a
                  href={currentFb.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-slate-600" />
                  <span>Comment</span>
                </a>
                <a
                  href={currentFb.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Share</span>
                </a>
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
              <FacebookIcon className="w-5 h-5 fill-current shrink-0" size={20} />
              <span>Visit Facebook Page</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: YOUTUBE (4 VIDEOS) ================= */}
        <div className="bg-white rounded-3xl border-2 border-[#FF0000]/20 hover:border-[#FF0000]/50 shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          {/* Top YouTube Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF0000]" />

          <div className="space-y-6">
            {/* Header: YouTube Channel Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF0000]/30">
                  <YouTubeIcon className="w-8 h-8 fill-current shrink-0" size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-brandNavy">
                      Padanama YouTube Channel
                    </h3>
                    <CheckCircle className="w-4 h-4 text-slate-500 fill-slate-500 text-white" />
                  </div>
                  <p className="text-xs text-ink-muted font-medium">@padanamapublication • Official Channel</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-[#FF0000]">
                    <Video className="w-3.5 h-3.5" />
                    <span>28,000+ Subscribers • 180+ Videos</span>
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

            {/* 4-Video Switcher Tabs */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-brandNavy block">
                Select from 4 Featured Educational Videos:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {YOUTUBE_VIDEOS.map((vid, idx) => (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => setSelectedYtIndex(idx)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedYtIndex === idx
                        ? "border-[#FF0000] bg-[#FF0000]/10 font-black text-[#FF0000] shadow-sm scale-102"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-semibold"
                    }`}
                  >
                    <span className="text-[11px] block truncate">Video {idx + 1}</span>
                    <span className="text-[9px] text-ink-muted block truncate">{vid.duration}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active YouTube Video Player Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3.5 transition-all">
              {/* Featured Video Player Mock */}
              <a
                href={currentYt.link}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl overflow-hidden relative aspect-[16/9] bg-black shadow-inner group/video cursor-pointer"
              >
                <img
                  src={currentYt.thumbnail}
                  alt={currentYt.title}
                  className="w-full h-full object-cover filter brightness-[0.78] group-hover/video:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-xl group-hover/video:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                  {currentYt.duration}
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#FF0000] text-white font-bold text-[10px] flex items-center gap-1 shadow">
                  <span>{currentYt.badge}</span>
                </div>
              </a>

              <div className="space-y-1.5">
                <a
                  href={currentYt.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block font-display font-extrabold text-sm sm:text-base text-brandNavy hover:text-[#FF0000] transition-colors leading-snug"
                >
                  {currentYt.title}
                </a>
                <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                  {currentYt.desc}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-ink-muted pt-1">
                  <span className="font-bold text-brandNavy">නැරඹුම් {currentYt.views}</span>
                  <span>•</span>
                  <span>{currentYt.time}</span>
                </div>
              </div>

              {/* 3 Secondary Mini Video Chips */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-extrabold text-brandNavy block">
                  More Educational Video Lessons:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {YOUTUBE_VIDEOS.filter((_, idx) => idx !== selectedYtIndex).slice(0, 3).map((vid) => (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => {
                        const originalIndex = YOUTUBE_VIDEOS.findIndex((v) => v.id === vid.id);
                        if (originalIndex !== -1) setSelectedYtIndex(originalIndex);
                      }}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#FF0000] text-brandNavy font-semibold flex items-center gap-2 truncate transition-colors text-left"
                    >
                      <Play className="w-3.5 h-3.5 text-[#FF0000] shrink-0" />
                      <span className="truncate text-[11px]">{vid.title}</span>
                    </button>
                  ))}
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
              <YouTubeIcon className="w-5 h-5 fill-current shrink-0" size={20} />
              <span>Visit YouTube Channel</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
