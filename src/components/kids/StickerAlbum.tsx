'use client';

import React, { useState, useEffect } from 'react';
import { STICKER_COLLECTION, Sticker } from '@/data/curriculum';
import { getProgress, UserProgress } from '@/lib/storage';
import { playClickSound, playCelebrationSound } from '@/lib/soundEffects';
import { speakText } from '@/lib/speech';
import { Star, Lock, Sparkles, Award, CheckCircle2, Trophy, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StickerAlbumProps {
  onProgressUpdate: () => void;
}

type CategoryFilter = 'all' | 'hewan' | 'petualang' | 'buah' | 'piala';

export default function StickerAlbum({ onProgressUpdate }: StickerAlbumProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const progress: UserProgress = getProgress();

  // Hitung jumlah stiker yang sudah terbuka berdasarkan bintang saat ini atau id tersimpan
  const unlockedCount = STICKER_COLLECTION.filter(
    (stk) =>
      progress.stars >= stk.unlockedAtStars ||
      (progress.unlockedStickerIds && progress.unlockedStickerIds.includes(stk.id))
  ).length;

  // Sambut anak dengan confetti jika ada stiker baru yang terbuka
  useEffect(() => {
    if (unlockedCount > 1) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [unlockedCount]);

  const handleStickerClick = (sticker: Sticker, isUnlocked: boolean) => {
    playClickSound();
    if (isUnlocked) {
      playCelebrationSound();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      speakText(`Hebat! Stiker ${sticker.title} sudah terbuka!`);
    } else {
      const needed = Math.max(1, sticker.unlockedAtStars - progress.stars);
      speakText(
        `Kumpulkan ${needed} bintang lagi untuk membuka stiker ${sticker.title}!`
      );
    }
  };

  const categories: { id: CategoryFilter; label: string; emoji: string }[] = [
    { id: 'all', label: 'Semua', emoji: '🌟' },
    { id: 'hewan', label: 'Sahabat Satwa', emoji: '🐾' },
    { id: 'petualang', label: 'Petualang Cilik', emoji: '🚀' },
    { id: 'buah', label: 'Buah & Alam', emoji: '🍎' },
    { id: 'piala', label: 'Piala Juara', emoji: '👑' },
  ];

  const filteredStickers = STICKER_COLLECTION.filter((stk) => {
    if (activeCategory === 'all') return true;
    return stk.category === activeCategory;
  });

  const percentComplete = Math.min(
    100,
    Math.round((unlockedCount / STICKER_COLLECTION.length) * 100)
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Album & Statistik Koleksi */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-6 sm:p-7 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-black backdrop-blur-sm mb-2.5 border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-100" />
            Galeri 32 Stiker Prestasi
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Album Koleksi Stiker Juara 🌟
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-semibold mt-1 max-w-lg">
            Selesaikan latihan membaca dan kuis untuk membuka ke-32 stiker lucu dan piala kehormatan!
          </p>

          {/* Bar Kemajuan Koleksi Keseluruhan */}
          <div className="mt-4 max-w-md">
            <div className="flex justify-between items-center text-xs font-black text-amber-100 mb-1">
              <span>Kelengkapan Album</span>
              <span>{percentComplete}% Selesai</span>
            </div>
            <div className="w-full bg-black/15 backdrop-blur-sm h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div
                className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Kotak Bintang Anak & Counter Stiker */}
        <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
          <div className="bg-white/20 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/30 flex items-center gap-3 shadow-sm">
            <Star className="w-9 h-9 fill-yellow-300 text-yellow-300 animate-bounce-slow" />
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-white leading-none">
                {progress.stars}
              </span>
              <span className="text-[11px] font-bold text-yellow-100 uppercase tracking-wider">Bintang Kamu</span>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/30 text-center shadow-sm">
            <span className="block text-2xl sm:text-3xl font-black text-white leading-none">
              {unlockedCount}/{STICKER_COLLECTION.length}
            </span>
            <span className="text-[11px] font-bold text-yellow-100 uppercase tracking-wider">Stiker Terbuka</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Kategori Stiker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const countInCat = cat.id === 'all'
            ? STICKER_COLLECTION.length
            : STICKER_COLLECTION.filter((s) => s.category === cat.id).length;
          const unlockedInCat = cat.id === 'all'
            ? unlockedCount
            : STICKER_COLLECTION.filter(
                (s) =>
                  s.category === cat.id &&
                  (progress.stars >= s.unlockedAtStars ||
                    (progress.unlockedStickerIds && progress.unlockedStickerIds.includes(s.id)))
              ).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                playClickSound();
                setActiveCategory(cat.id);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition flex items-center gap-2 btn-kids-pop ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-amber-600/80 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {unlockedInCat}/{countInCat}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Grid 32 Stiker */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
        {filteredStickers.map((sticker) => {
          const isUnlocked =
            progress.stars >= sticker.unlockedAtStars ||
            (progress.unlockedStickerIds &&
              progress.unlockedStickerIds.includes(sticker.id));

          const percentProgress = Math.min(
            100,
            Math.round((progress.stars / sticker.unlockedAtStars) * 100)
          );

          const remainingStars = Math.max(0, sticker.unlockedAtStars - progress.stars);

          // Warna tema per kategori
          const categoryBadge =
            sticker.category === 'hewan'
              ? '🐾 Satwa'
              : sticker.category === 'petualang'
              ? '🚀 Petualang'
              : sticker.category === 'buah'
              ? '🍎 Buah'
              : '👑 Juara';

          return (
            <div
              key={sticker.id}
              onClick={() => handleStickerClick(sticker, isUnlocked)}
              className={`rounded-3xl p-5 border-2 transition cursor-pointer flex flex-col items-center text-center btn-kids-pop relative ${
                isUnlocked
                  ? 'bg-gradient-to-b from-white to-amber-50/50 border-amber-300 shadow-md hover:shadow-xl ring-2 ring-amber-100/70 hover:-translate-y-1'
                  : 'bg-white/70 border-dashed border-slate-300 opacity-85 hover:opacity-100 hover:border-slate-400'
              }`}
            >
              {/* Badge Kategori & Status Kunci */}
              <div className="w-full flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md">
                  {categoryBadge}
                </span>

                <div>
                  {isUnlocked ? (
                    <span className="text-amber-500 bg-amber-100/80 p-1 rounded-full flex items-center justify-center">
                      <Award className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-slate-400 bg-slate-100 p-1 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Emoji Stiker Besar */}
              <div
                className={`text-6xl my-2.5 select-none transition-transform duration-200 hover:scale-115 ${
                  isUnlocked ? 'animate-pulse-subtle filter drop-shadow-sm' : 'filter grayscale opacity-35'
                }`}
              >
                {sticker.emoji}
              </div>

              {/* Judul & Keterangan Singkat */}
              <h4 className="font-black text-slate-800 text-sm sm:text-base mb-1 leading-snug">
                {sticker.title}
              </h4>
              <p className="text-[11px] text-slate-500 mb-3 font-medium leading-tight">
                {sticker.description}
              </p>

              {/* Status / Syarat Buka & Progress Bar */}
              <div className="mt-auto w-full pt-2.5 border-t border-slate-100">
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-full shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sudah Terbuka
                  </span>
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 pt-0.5">
                      <span>Syarat: {sticker.unlockedAtStars} ⭐</span>
                      <span className="text-orange-600">Kurang {remainingStars} ⭐</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
