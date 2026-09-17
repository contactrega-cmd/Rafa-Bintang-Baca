'use client';

import React from 'react';
import { STICKER_COLLECTION, Sticker } from '@/data/curriculum';
import { getProgress, UserProgress } from '@/lib/storage';
import { playClickSound, playCelebrationSound } from '@/lib/soundEffects';
import { speakText } from '@/lib/speech';
import { Star, Lock, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StickerAlbumProps {
  onProgressUpdate: () => void;
}

export default function StickerAlbum({ onProgressUpdate }: StickerAlbumProps) {
  const progress: UserProgress = getProgress();

  const handleStickerClick = (sticker: Sticker, isUnlocked: boolean) => {
    playClickSound();
    if (isUnlocked) {
      playCelebrationSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      speakText(`Hebat! Stiker ${sticker.title}!`);
    } else {
      speakText(`Kumpulkan ${sticker.unlockedAtStars} bintang untuk membuka stiker ${sticker.title}`);
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
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Album Koleksi Stiker Juara 🌟
          </h2>
          <p className="text-amber-100 text-sm md:text-base mt-1">
            Kumpulkan bintang dari setiap modul dan kuis untuk membuka stiker-stiker lucu!
          </p>
        </div>

        {/* Kotak Bintang Anak */}
        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 flex items-center gap-3">
          <Star className="w-8 h-8 fill-yellow-300 text-yellow-300 animate-bounce-slow" />
          <div>
            <span className="block text-2xl font-black text-white leading-none">
              {progress.stars}
            </span>
            <span className="text-xs font-semibold text-yellow-100">Bintang Kamu</span>
          </div>
        </div>
      </div>

      {/* Grid Stiker */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {STICKER_COLLECTION.map((sticker) => {
          const isUnlocked = progress.unlockedStickerIds.includes(sticker.id);

          return (
            <div
              key={sticker.id}
              onClick={() => handleStickerClick(sticker, isUnlocked)}
              className={`rounded-3xl p-5 border-2 transition cursor-pointer flex flex-col items-center text-center btn-kids-pop relative ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-md hover:shadow-lg'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-70'
              }`}
            >
              {/* Ikon Kunci atau Bintang */}
              <div className="absolute top-3 right-3">
                {isUnlocked ? (
                  <span className="text-amber-500">
                    <Award className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Emoji Stiker */}
              <div className={`text-6xl my-3 select-none ${isUnlocked ? 'animate-pulse-subtle' : 'filter grayscale'}`}>
                {sticker.emoji}
              </div>

              {/* Judul & Keterangan */}
              <h4 className="font-extrabold text-slate-800 text-base mb-1">
                {sticker.title}
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                {sticker.description}
              </p>

              {/* Syarat Buka */}
              <div className="mt-auto w-full pt-2 border-t border-slate-100">
                {isUnlocked ? (
                  <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    ✓ Sudah Terbuka
                  </span>
                ) : (
                  <span className="inline-block text-[11px] font-bold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">
                    Butuh {sticker.unlockedAtStars} ⭐
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
