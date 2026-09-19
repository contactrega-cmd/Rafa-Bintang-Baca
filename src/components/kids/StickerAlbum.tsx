'use client';

import React, { useEffect } from 'react';
import { STICKER_COLLECTION, Sticker } from '@/data/curriculum';
import { getProgress, UserProgress } from '@/lib/storage';
import { playClickSound, playCelebrationSound } from '@/lib/soundEffects';
import { speakText } from '@/lib/speech';
import { Star, Lock, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StickerAlbumProps {
  onProgressUpdate: () => void;
}

export default function StickerAlbum({ onProgressUpdate }: StickerAlbumProps) {
  const progress: UserProgress = getProgress();

  // Hitung jumlah stiker yang sudah terbuka berdasarkan bintang saat ini
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

  return (
    <div className="space-y-6">
      {/* Header Album */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-6 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="w-4 h-4 text-yellow-100" />
            Galeri Penghargaan
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Album Koleksi Stiker Juara 🌟
          </h2>
          <p className="text-amber-100 text-sm md:text-base mt-1">
            Stiker otomatis terbuka saat jumlah bintang belajarmu bertambah!
          </p>
        </div>

        {/* Kotak Bintang Anak & Counter Stiker */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 flex items-center gap-3">
            <Star className="w-8 h-8 fill-yellow-300 text-yellow-300 animate-bounce-slow" />
            <div>
              <span className="block text-2xl font-black text-white leading-none">
                {progress.stars}
              </span>
              <span className="text-xs font-semibold text-yellow-100">Bintang Kamu</span>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-center">
            <span className="block text-2xl font-black text-white leading-none">
              {unlockedCount}/{STICKER_COLLECTION.length}
            </span>
            <span className="text-xs font-semibold text-yellow-100">Terbuka</span>
          </div>
        </div>
      </div>

      {/* Grid Stiker */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {STICKER_COLLECTION.map((sticker) => {
          // Logika pembukaan stiker langsung berdasarkan bintang anak atau id yang tersimpan
          const isUnlocked =
            progress.stars >= sticker.unlockedAtStars ||
            (progress.unlockedStickerIds &&
              progress.unlockedStickerIds.includes(sticker.id));

          const percentProgress = Math.min(
            100,
            Math.round((progress.stars / sticker.unlockedAtStars) * 100)
          );

          const remainingStars = Math.max(0, sticker.unlockedAtStars - progress.stars);

          return (
            <div
              key={sticker.id}
              onClick={() => handleStickerClick(sticker, isUnlocked)}
              className={`rounded-3xl p-5 border-2 transition cursor-pointer flex flex-col items-center text-center btn-kids-pop relative ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-md hover:shadow-xl ring-2 ring-amber-100/70'
                  : 'bg-white/70 border-dashed border-slate-300 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Ikon Kunci atau Bintang */}
              <div className="absolute top-3 right-3">
                {isUnlocked ? (
                  <span className="text-amber-500 bg-amber-50 p-1 rounded-full">
                    <Award className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="text-slate-400 bg-slate-100 p-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Emoji Stiker */}
              <div
                className={`text-6xl my-3 select-none transition-transform duration-200 hover:scale-110 ${
                  isUnlocked ? 'animate-pulse-subtle' : 'filter grayscale opacity-45'
                }`}
              >
                {sticker.emoji}
              </div>

              {/* Judul & Keterangan */}
              <h4 className="font-extrabold text-slate-800 text-base mb-1">
                {sticker.title}
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                {sticker.description}
              </p>

              {/* Status / Syarat Buka & Progress Bar */}
              <div className="mt-auto w-full pt-2 border-t border-slate-100">
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sudah Terbuka
                  </span>
                ) : (
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 pt-0.5">
                      <span>Butuh {sticker.unlockedAtStars} ⭐</span>
                      <span className="text-amber-600">Kurang {remainingStars} lagi</span>
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
