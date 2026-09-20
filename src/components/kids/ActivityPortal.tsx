'use client';

import React from 'react';
import { UserProgress } from '@/lib/storage';
import { playClickSound } from '@/lib/soundEffects';
import {
  Star,
  Trophy,
  BookOpen,
  ArrowRight,
  CheckCircle2,
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
  description: string;
  currentProgress: number;
  maxProgress: number | null;
  unit: string;
  gradient: string;
  iconBg: string;
  shadowColor: string;
  borderAccent: string;
  btnBg: string;
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
      tag: 'Modul 1 • Fondasi Fonik',
      title: 'Huruf & Vokal',
      emoji: '🔤',
      description: 'Mengenal 26 alfabet A–Z beserta pengucapan bunyi vokal dan fonik jernih.',
      currentProgress: lettersLearned,
      maxProgress: 26,
      unit: 'Huruf Selesai',
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-300',
      shadowColor: 'shadow-orange-200/60 hover:shadow-orange-300/80',
      borderAccent: 'border-orange-200 hover:border-orange-400',
      btnBg: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white',
    },
    {
      id: 'syllables',
      moduleNumber: '02',
      tag: 'Modul 2 • Penggabungan Bunyi',
      title: 'Suku Kata Terbuka',
      emoji: '🗣️',
      description: 'Latihan merangkai konsonan dan vokal seperti ba, bi, bu, be, bo hingga za, zi, zu.',
      currentProgress: syllablesLearned,
      maxProgress: 60,
      unit: 'Suku Kata',
      gradient: 'from-sky-500 to-blue-600',
      iconBg: 'bg-sky-100 text-sky-800 border-sky-300',
      shadowColor: 'shadow-blue-200/60 hover:shadow-blue-300/80',
      borderAccent: 'border-sky-200 hover:border-sky-400',
      btnBg: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white',
    },
    {
      id: 'words',
      moduleNumber: '03',
      tag: 'Modul 3 • Kata Bergambar',
      title: 'Membaca Kata & Ejaan',
      emoji: '📖',
      description: 'Mengeja 64 kata benda & hewan berbalok warna ceria 2 dan 3 suku kata.',
      currentProgress: wordsLearned,
      maxProgress: 64,
      unit: 'Kata Terbaca',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      shadowColor: 'shadow-emerald-200/60 hover:shadow-emerald-300/80',
      borderAccent: 'border-emerald-200 hover:border-emerald-400',
      btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white',
    },
    {
      id: 'sentences',
      moduleNumber: '04',
      tag: 'Modul 4 • Cerita Ramah Anak',
      title: 'Membaca Kalimat Pendek',
      emoji: '🌟',
      description: 'Membaca 30 kalimat cerita pendek sederhana bertema keluarga, hewan, dan alam.',
      currentProgress: sentencesLearned,
      maxProgress: 30,
      unit: 'Kalimat Selesai',
      gradient: 'from-purple-500 to-violet-600',
      iconBg: 'bg-purple-100 text-purple-800 border-purple-300',
      shadowColor: 'shadow-purple-200/60 hover:shadow-purple-300/80',
      borderAccent: 'border-purple-200 hover:border-purple-400',
      btnBg: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white',
    },
    {
      id: 'quiz',
      moduleNumber: '05',
      tag: 'Modul 5 • Uji Ketangkasan',
      title: 'Arena Kuis Ceria',
      emoji: '🎮',
      description: '3 mini-game seru: Tebak Gambar, Balok Ejaan, dan Dengar Kata berhadiah bintang!',
      currentProgress: quizCount,
      maxProgress: null,
      unit: 'Kuis Selesai',
      gradient: 'from-rose-500 to-pink-600',
      iconBg: 'bg-rose-100 text-rose-800 border-rose-300',
      shadowColor: 'shadow-rose-200/60 hover:shadow-rose-300/80',
      borderAccent: 'border-rose-200 hover:border-rose-400',
      btnBg: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white',
    },
    {
      id: 'stickers',
      moduleNumber: '06',
      tag: 'Modul 6 • Hadiah Prestasi',
      title: 'Album Koleksi Stiker',
      emoji: '🏆',
      description: 'Buka dan pajang 8 stiker hewan lucu sebagai penghargaan ketekunan belajar.',
      currentProgress: stickersUnlocked,
      maxProgress: 8,
      unit: 'Stiker Terbuka',
      gradient: 'from-amber-400 to-yellow-500',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-300',
      shadowColor: 'shadow-yellow-200/60 hover:shadow-yellow-300/80',
      borderAccent: 'border-amber-200 hover:border-amber-400',
      btnBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white',
    },
  ];

  const handleCardClick = (tab: ActivityTab) => {
    playClickSound();
    onSelectActivity(tab);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. HERO LAUNCHPAD GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-amber-50/90 to-orange-50/90 backdrop-blur-md border-2 border-amber-200/80 p-6 sm:p-8 shadow-xl shadow-amber-100/60">
        {/* Hiasan Latar Geometris & Balon Lucu */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-orange-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Sisi Kiri: Profil & Sambutan */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
            {/* Avatar Ceria dengan Ring Animasi */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-lg shadow-amber-300/50 flex items-center justify-center transform hover:scale-105 transition">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-4xl sm:text-5xl select-none">
                  {progress.avatar}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md border-2 border-white flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-white" />
                <span>{progress.stars}</span>
              </div>
            </div>

            {/* Teks Sambutan */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider mb-2 border border-orange-200">
                <Compass className="w-3.5 h-3.5 text-orange-600 animate-spin-slow" />
                <span>Portal Petualangan Membaca</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
                Halo, <span className="text-orange-600">{progress.childName}</span>! 👋
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-xl">
                Siap berpetualang membaca hari ini? Pilih aktivitas seru di bawah untuk mengumpulkan lebih banyak bintang dan stiker!
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Statistik Ringkas Anak (3 Badge Interaktif) */}
          <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2.5 sm:gap-3 w-full md:w-auto">
            {/* Badge Bintang */}
            <div className="flex-1 min-w-[95px] bg-white/95 rounded-2xl p-3 border border-amber-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-lg font-black text-slate-800">{progress.stars}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-500">Bintang</span>
            </div>

            {/* Badge Stiker */}
            <div className="flex-1 min-w-[95px] bg-white/95 rounded-2xl p-3 border border-amber-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-600 mb-0.5">
                <Trophy className="w-4 h-4" />
                <span className="text-lg font-black text-slate-800">{stickersUnlocked}/8</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-500">Stiker</span>
            </div>

            {/* Badge Total Materi */}
            <div className="flex-1 min-w-[95px] bg-white/95 rounded-2xl p-3 border border-amber-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
                <BookOpen className="w-4 h-4" />
                <span className="text-lg font-black text-slate-800">{totalMastered}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-500">Materi Selesai</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRID 6 KARTU MODUL AKTIVITAS (LAUNCHPAD STYLE) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              Pilih Aktivitas Belajar
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
            6 Modul Lengkap
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {activityCards.map((card) => {
            const hasProgressMax = card.maxProgress !== null;
            const percentage = hasProgressMax
              ? Math.min(100, Math.round((card.currentProgress / (card.maxProgress || 1)) * 100))
              : null;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`group relative bg-white/95 backdrop-blur-sm rounded-3xl border-2 ${card.borderAccent} p-5 sm:p-6 shadow-md ${card.shadowColor} transition-all duration-200 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden`}
              >
                {/* Nomor Urut Modul Halus di Sudut Kanan Atas */}
                <div className="absolute top-4 right-5 text-3xl font-black text-slate-200/80 group-hover:text-slate-300 transition select-none">
                  {card.moduleNumber}
                </div>

                {/* Header Kartu: Emoji & Tag Modul */}
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl ${card.iconBg} border flex items-center justify-center text-3xl shadow-sm transform group-hover:scale-110 transition`}
                    >
                      {card.emoji}
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                        {card.tag}
                      </span>
                      <h4 className="text-lg sm:text-xl font-black text-slate-800 group-hover:text-orange-600 transition leading-tight">
                        {card.title}
                      </h4>
                    </div>
                  </div>

                  {/* Deskripsi Singkat */}
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                {/* Bagian Bawah: Progress Bar & Tombol Akses */}
                <div className="pt-3 border-t border-slate-100">
                  {/* Status Progres Belajar */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
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
                      <span className="text-[11px] font-black text-orange-600">
                        {percentage}%
                      </span>
                    )}
                  </div>

                  {/* Bar Progres */}
                  {percentage !== null && (
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-3.5 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-500 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}

                  {/* Tombol Buka Latihan */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card.id);
                    }}
                    className={`w-full py-2.5 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 ${card.btnBg} transition transform active:scale-95 btn-kids-pop`}
                  >
                    <span>Mulai Aktivitas</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
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
