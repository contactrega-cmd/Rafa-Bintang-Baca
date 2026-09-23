'use client';

import React from 'react';
import { STICKER_COLLECTION } from '@/data/curriculum';
import { UserProgress } from '@/lib/storage';
import { playClickSound } from '@/lib/soundEffects';
import {
  Star,
  Trophy,
  BookOpen,
  ArrowRight,
  Sparkles,
  Compass,
} from 'lucide-react';

export type ActivityTab = 'alphabet' | 'syllables' | 'words' | 'sentences' | 'quiz' | 'stickers';

interface ActivityPortalProps {
  progress: UserProgress;
  onSelectActivity: (tab: ActivityTab) => void;
}

interface ActivityCardItem {
  id: ActivityTab;
  moduleNumber: string;
  tag: string;
  title: string;
  emoji: string;
  subtitle: string;
  visualPreview: React.ReactNode;
  currentProgress: number;
  maxProgress: number | null;
  unit: string;
  gradient: string;
  iconBg: string;
  cardBg: string;
  borderAccent: string;
  shadowColor: string;
  btnBg: string;
  btnText: string;
}

export default function ActivityPortal({
  progress,
  onSelectActivity,
}: ActivityPortalProps) {
  const lettersLearned = progress.learnedLetters?.length || 0;
  const syllablesLearned = progress.learnedSyllables?.length || 0;
  const wordsLearned = progress.learnedWords?.length || 0;
  const sentencesLearned = progress.learnedSentences?.length || 0;
  const stickersUnlocked = progress.unlockedStickerIds?.length || 0;
  const quizCount = progress.quizHistory?.length || 0;

  const totalMastered = lettersLearned + syllablesLearned + wordsLearned + sentencesLearned;

  const activityCards: ActivityCardItem[] = [
    {
      id: 'alphabet',
      moduleNumber: '01',
      tag: 'Modul 1',
      title: 'Huruf & Vokal',
      emoji: '🔤',
      subtitle: '26 Alfabet A–Z & Bunyi Fonik',
      visualPreview: (
        <div className="flex items-center justify-center gap-2 py-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 text-white font-black text-xl flex items-center justify-center shadow-md transform -rotate-6 hover:rotate-0 transition">
            A
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-xl flex items-center justify-center shadow-md transform rotate-3 hover:rotate-0 transition">
            B
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-md transform -rotate-3 hover:rotate-0 transition">
            C
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white font-black text-xl flex items-center justify-center shadow-md transform rotate-6 hover:rotate-0 transition">
            D
          </div>
        </div>
      ),
      currentProgress: lettersLearned,
      maxProgress: 26,
      unit: 'Huruf',
      gradient: 'from-amber-400 to-orange-500',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-300',
      cardBg: 'from-amber-50/70 via-white to-orange-50/40',
      borderAccent: 'border-amber-300/80 hover:border-amber-400',
      shadowColor: 'shadow-amber-200/50 hover:shadow-amber-300/70',
      btnBg: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-200',
      btnText: 'Mulai Belajar',
    },
    {
      id: 'syllables',
      moduleNumber: '02',
      tag: 'Modul 2',
      title: 'Suku Kata',
      emoji: '🗣️',
      subtitle: 'Gabungan ba, bi, bu, be, bo...',
      visualPreview: (
        <div className="flex flex-wrap items-center justify-center gap-1.5 py-1">
          {['ba', 'bi', 'bu', 'be', 'bo'].map((syl, i) => (
            <span
              key={syl}
              className={`px-3 py-1 rounded-xl font-black text-sm shadow-xs border ${
                i % 2 === 0
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-blue-100 text-blue-800 border-blue-300'
              }`}
            >
              {syl}
            </span>
          ))}
        </div>
      ),
      currentProgress: syllablesLearned,
      maxProgress: 60,
      unit: 'Suku Kata',
      gradient: 'from-sky-400 to-blue-600',
      iconBg: 'bg-sky-100 text-sky-800 border-sky-300',
      cardBg: 'from-sky-50/70 via-white to-blue-50/40',
      borderAccent: 'border-sky-300/80 hover:border-sky-400',
      shadowColor: 'shadow-sky-200/50 hover:shadow-sky-300/70',
      btnBg: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sky-200',
      btnText: 'Mulai Latihan',
    },
    {
      id: 'words',
      moduleNumber: '03',
      tag: 'Modul 3',
      title: 'Membaca Kata',
      emoji: '📖',
      subtitle: '64 Kata Bergambar 2 & 3 Balok',
      visualPreview: (
        <div className="flex flex-wrap items-center justify-center gap-2 py-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs shadow-xs">
            <span className="text-base">🍎</span>
            <span>a-pel</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-teal-100 border border-teal-300 text-teal-900 font-extrabold text-xs shadow-xs">
            <span className="text-base">🐱</span>
            <span>ku-cing</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-lime-100 border border-lime-300 text-lime-900 font-extrabold text-xs shadow-xs">
            <span className="text-base">⚽</span>
            <span>bo-la</span>
          </span>
        </div>
      ),
      currentProgress: wordsLearned,
      maxProgress: 64,
      unit: 'Kata',
      gradient: 'from-emerald-400 to-teal-600',
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      cardBg: 'from-emerald-50/70 via-white to-teal-50/40',
      borderAccent: 'border-emerald-300/80 hover:border-emerald-400',
      shadowColor: 'shadow-emerald-200/50 hover:shadow-emerald-300/70',
      btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-200',
      btnText: 'Mulai Membaca',
    },
    {
      id: 'sentences',
      moduleNumber: '04',
      tag: 'Modul 4',
      title: 'Kalimat Pendek',
      emoji: '🌟',
      subtitle: '30 Cerita Bergambar Ramah Anak',
      visualPreview: (
        <div className="flex flex-col gap-1.5 py-1 w-full max-w-[260px] mx-auto">
          <div className="bg-purple-100/90 border border-purple-300 rounded-xl px-2.5 py-1 text-purple-900 font-extrabold text-xs flex items-center gap-1.5 shadow-xs truncate">
            <span className="text-sm">🍎</span>
            <span className="truncate">"Ibu Beli Apel Segar"</span>
          </div>
          <div className="bg-indigo-100/90 border border-indigo-300 rounded-xl px-2.5 py-1 text-indigo-900 font-extrabold text-xs flex items-center gap-1.5 shadow-xs truncate">
            <span className="text-sm">🐱</span>
            <span className="truncate">"Kucing Sedang Tidur"</span>
          </div>
        </div>
      ),
      currentProgress: sentencesLearned,
      maxProgress: 30,
      unit: 'Kalimat',
      gradient: 'from-purple-400 to-violet-600',
      iconBg: 'bg-purple-100 text-purple-800 border-purple-300',
      cardBg: 'from-purple-50/70 via-white to-violet-50/40',
      borderAccent: 'border-purple-300/80 hover:border-purple-400',
      shadowColor: 'shadow-purple-200/50 hover:shadow-purple-300/70',
      btnBg: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-purple-200',
      btnText: 'Baca Cerita',
    },
    {
      id: 'quiz',
      moduleNumber: '05',
      tag: 'Modul 5',
      title: 'Arena Kuis',
      emoji: '🎮',
      subtitle: 'Mini-Game Seru Berhadiah Bintang',
      visualPreview: (
        <div className="flex flex-wrap items-center justify-center gap-2 py-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 font-black text-xs shadow-xs">
            <span>🎯</span>
            <span>Tebak Gambar</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-pink-100 border border-pink-300 text-pink-900 font-black text-xs shadow-xs">
            <span>🧩</span>
            <span>Susun Balok</span>
          </span>
        </div>
      ),
      currentProgress: quizCount,
      maxProgress: null,
      unit: 'Kuis Selesai',
      gradient: 'from-rose-400 to-pink-600',
      iconBg: 'bg-rose-100 text-rose-800 border-rose-300',
      cardBg: 'from-rose-50/70 via-white to-pink-50/40',
      borderAccent: 'border-rose-300/80 hover:border-rose-400',
      shadowColor: 'shadow-rose-200/50 hover:shadow-rose-300/70',
      btnBg: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-200',
      btnText: 'Main Kuis',
    },
    {
      id: 'stickers',
      moduleNumber: '06',
      tag: 'Modul 6',
      title: 'Album Stiker',
      emoji: '🏆',
      subtitle: `${STICKER_COLLECTION.length} Stiker Prestasi & Hadiah`,
      visualPreview: (
        <div className="flex items-center justify-center gap-1.5 py-1">
          {['🦁', '🚀', '🍎', '👑', '🏆'].map((item, i) => (
            <div
              key={item}
              className={`w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-xs transform hover:scale-125 transition ${
                i % 2 === 0 ? '-rotate-6' : 'rotate-6'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      ),
      currentProgress: stickersUnlocked,
      maxProgress: STICKER_COLLECTION.length,
      unit: 'Stiker',
      gradient: 'from-amber-400 to-yellow-500',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-300',
      cardBg: 'from-amber-50/70 via-white to-yellow-50/40',
      borderAccent: 'border-amber-300/80 hover:border-amber-400',
      shadowColor: 'shadow-amber-200/50 hover:shadow-amber-300/70',
      btnBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-amber-200',
      btnText: 'Buka Album',
    },
  ];

  const handleCardClick = (tab: ActivityTab) => {
    playClickSound();
    onSelectActivity(tab);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. HERO LAUNCHPAD GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-amber-50/90 to-orange-50/90 backdrop-blur-md border-2 border-amber-200/80 p-5 sm:p-7 shadow-xl shadow-amber-100/60">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-orange-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
          {/* Profil & Salam Singkat Ceria */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-lg shadow-amber-300/50 flex items-center justify-center transform hover:scale-105 transition">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl select-none">
                  {progress.avatar}
                </div>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md border-2 border-white flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-white" />
                <span>{progress.stars}</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider mb-1.5 border border-orange-200">
                <Compass className="w-3.5 h-3.5 text-orange-600 animate-spin-slow" />
                <span>Portal Petualangan Membaca</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Halo, <span className="text-orange-600">{progress.childName}</span>! 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-bold mt-0.5">
                Yuk pilih aktivitas seru di bawah untuk kumpulkan bintang! ⭐
              </p>
            </div>
          </div>

          {/* 3 Badge Statistik Ringkas */}
          <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2.5 w-full md:w-auto">
            <div className="flex-1 min-w-[90px] bg-white/95 rounded-2xl p-2.5 border border-amber-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-lg font-black text-slate-800">{progress.stars}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-500">Bintang</span>
            </div>

            <div className="flex-1 min-w-[90px] bg-white/95 rounded-2xl p-2.5 border border-amber-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-600">
                <Trophy className="w-4 h-4" />
                <span className="text-lg font-black text-slate-800">{stickersUnlocked}/{STICKER_COLLECTION.length}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-500">Stiker</span>
            </div>

            <div className="flex-1 min-w-[90px] bg-white/95 rounded-2xl p-2.5 border border-amber-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600">
                <BookOpen className="w-4 h-4" />
                <span className="text-lg font-black text-slate-800">{totalMastered}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-500">Selesai</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRID 6 KARTU MODUL AKTIVITAS (VISUAL & MENARIK UNTUK ANAK TK) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              Pilih Aktivitas Belajar
            </h3>
          </div>
          <span className="text-xs font-extrabold text-orange-700 bg-orange-100/90 px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>6 Pilihan Seru</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activityCards.map((card) => {
            const hasProgressMax = card.maxProgress !== null;
            const percentage = hasProgressMax
              ? Math.min(100, Math.round((card.currentProgress / (card.maxProgress || 1)) * 100))
              : null;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`group relative bg-gradient-to-br ${card.cardBg} backdrop-blur-sm rounded-3xl border-2 ${card.borderAccent} p-5 shadow-md ${card.shadowColor} transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between overflow-hidden`}
              >
                {/* Badge Nomor Modul di Sudut Kanan */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xs border border-slate-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-black text-slate-500 shadow-2xs">
                  {card.tag}
                </div>

                {/* Header Kartu: Emoji Besar & Judul Tegas */}
                <div className="mb-2">
                  <div className="flex items-center gap-3.5 mb-2">
                    <div
                      className={`w-14 h-14 rounded-2xl ${card.iconBg} border-2 flex items-center justify-center text-3xl shadow-sm transform group-hover:scale-110 transition flex-shrink-0`}
                    >
                      {card.emoji}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800 group-hover:text-orange-600 transition leading-tight">
                        {card.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-500 block mt-0.5">
                        {card.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* PREVIEW VISUAL RAMAH ANAK (Balok Huruf, Suku Kata, Gambar Benda, dll) */}
                  <div className="bg-white/85 rounded-2xl p-3 my-3 border border-slate-200/70 shadow-2xs flex items-center justify-center min-h-[64px]">
                    {card.visualPreview}
                  </div>
                </div>

                {/* Progress Bar & Tombol Akses */}
                <div className="pt-2">
                  {/* Status Capaian */}
                  <div className="flex items-center justify-between text-xs font-black text-slate-600 mb-1.5 px-0.5">
                    <span className="flex items-center gap-1 text-slate-700">
                      <span>⭐</span>
                      {hasProgressMax ? (
                        <span>
                          {card.currentProgress} / {card.maxProgress} {card.unit}
                        </span>
                      ) : (
                        <span>
                          {card.currentProgress} {card.unit}
                        </span>
                      )}
                    </span>
                    {percentage !== null && (
                      <span className="text-[11px] font-black text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-200">
                        {percentage}%
                      </span>
                    )}
                  </div>

                  {/* Bar Progres */}
                  {percentage !== null && (
                    <div className="w-full bg-slate-200/70 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-500 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}

                  {/* Tombol Aksi Ceria */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card.id);
                    }}
                    className={`w-full py-3 px-4 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 ${card.btnBg} transition transform active:scale-95 btn-kids-pop`}
                  >
                    <span>{card.btnText}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
