'use client';

import React, { useState, useEffect } from 'react';
import ActivityPortal, { ActivityTab } from '@/components/kids/ActivityPortal';
import AlphabetModule from '@/components/kids/AlphabetModule';
import SyllableModule from '@/components/kids/SyllableModule';
import WordReadingModule from '@/components/kids/WordReadingModule';
import SentenceModule from '@/components/kids/SentenceModule';
import QuizArena from '@/components/kids/QuizArena';
import StickerAlbum from '@/components/kids/StickerAlbum';
import ParentDashboard from '@/components/parent/ParentDashboard';
import KidsBackground from '@/components/common/KidsBackground';
import ProfileLoginScreen from '@/components/auth/ProfileLoginScreen';
import {
  getProgress,
  saveProgress,
  getActiveProfile,
  setActiveProfileId,
  UserProgress,
} from '@/lib/storage';
import { playClickSound } from '@/lib/soundEffects';
import {
  Star,
  Sparkles,
  BookOpen,
  Volume2,
  Trophy,
  Smile,
  ShieldCheck,
  Gamepad2,
  Heart,
  Type,
  Gauge,
  Users,
  Home as HomeIcon,
  ArrowLeft,
} from 'lucide-react';

export type TabType = 'portal' | ActivityTab;
type AppMode = 'kids' | 'parent';

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>('kids');
  const [activeTab, setActiveTab] = useState<TabType>('portal');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  const refreshProgress = () => {
    const active = getActiveProfile();
    if (active) {
      setProgress(active);
      setIsLoggedIn(true);
    } else {
      setProgress(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    refreshProgress();
    setIsClientLoaded(true);
  }, []);

  const handleSelectProfile = (selected: UserProgress) => {
    setActiveProfileId(selected.id);
    setProgress(selected);
    setIsLoggedIn(true);
    setActiveTab('portal');
  };

  const handleSwitchAccount = () => {
    playClickSound();
    setActiveProfileId(null);
    setProgress(null);
    setIsLoggedIn(false);
  };

  const handleModeChange = (mode: AppMode) => {
    playClickSound();
    setAppMode(mode);
  };

  const handleTabChange = (tab: TabType) => {
    playClickSound();
    setActiveTab(tab);
  };

  const currentFontClass = "font-['Plus_Jakarta_Sans',sans-serif]";

  const navTabs: { id: ActivityTab; label: string; emoji: string; color: string }[] = [
    { id: 'alphabet', label: 'Huruf & Vokal', emoji: '🔤', color: 'bg-orange-500' },
    { id: 'syllables', label: 'Suku Kata', emoji: '🗣️', color: 'bg-blue-500' },
    { id: 'words', label: 'Membaca Kata', emoji: '📖', color: 'bg-teal-500' },
    { id: 'sentences', label: 'Kalimat Pendek', emoji: '🌟', color: 'bg-purple-500' },
    { id: 'quiz', label: 'Arena Kuis', emoji: '🎮', color: 'bg-rose-500' },
    { id: 'stickers', label: 'Album Stiker', emoji: '🏆', color: 'bg-amber-500' },
  ];

  const currentTabInfo = navTabs.find((t) => t.id === activeTab);

  // Selama client storage sedang diinisialisasi
  if (!isClientLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-playful-canvas font-sans">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-white flex items-center justify-center text-3xl mx-auto mb-3 animate-bounce">
            ⭐
          </div>
          <span className="font-extrabold text-slate-700 text-lg">
            Membuka RafaBintangBaca...
          </span>
        </div>
      </div>
    );
  }

  // 1. JIKA BELUM MEMILIH AKUN / MASUK, TAMPILKAN HALAMAN PILIH PROFIL & KARAKTER HEWAN
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col bg-playful-canvas relative overflow-x-hidden ${currentFontClass}`}>
        <KidsBackground />
        <ProfileLoginScreen onSelectProfile={handleSelectProfile} />
      </div>
    );
  }

  // 2. JIKA SUDAH MEMILIH AKUN, TAMPILKAN APLIKASI UTAMA
  return (
    <div className={`min-h-screen flex flex-col bg-playful-canvas relative overflow-x-hidden ${currentFontClass}`}>
      {/* Background Ceria Kartun Dunia Anak */}
      <KidsBackground />

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-sm relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Logo & Brand (Klik untuk kembali ke Menu Utama) */}
          <div
            onClick={() => {
              playClickSound();
              setAppMode('kids');
              setActiveTab('portal');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Klik untuk ke Halaman Depan / Menu Utama"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-200 group-hover:scale-105 transition transform">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none group-hover:text-orange-600 transition">
              RafaBintang<span className="text-orange-500">Baca</span>
            </h1>
          </div>

          {/* Profil Anak & Ganti Akun & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Profil Anak Aktif */}
            {progress && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  onClick={handleSwitchAccount}
                  className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-xs font-extrabold text-slate-700 cursor-pointer hover:bg-amber-100 transition shadow-xs"
                  title="Klik untuk ganti akun anak"
                >
                  <span className="text-base">{progress.avatar}</span>
                  <span className="max-w-[70px] sm:max-w-none truncate">{progress.childName}</span>
                  <span className="text-[11px] text-amber-600 font-black">({progress.stars} ⭐)</span>
                </div>

                <button
                  onClick={handleSwitchAccount}
                  title="Ganti akun / masuk akun anak lain"
                  className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-xs font-bold text-slate-600 transition btn-kids-pop"
                >
                  <Users className="w-3.5 h-3.5 text-orange-600" />
                  <span>Ganti Akun</span>
                </button>
              </div>
            )}

            {/* Switcher Mode Anak <-> Mode Orang Tua */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => handleModeChange('kids')}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                  appMode === 'kids'
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Anak</span>
              </button>
              <button
                onClick={() => handleModeChange('parent')}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                  appMode === 'parent'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Orang Tua</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 relative z-10">
        {/* Render Konten Sesuai Mode */}
        {appMode === 'parent' ? (
          <div>
            {/* Tombol Kembali ke Mode Anak */}
            <div className="mb-5 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 shadow-xs">
              <button
                onClick={() => handleModeChange('kids')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-sm transition btn-kids-pop"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Mode Anak</span>
              </button>
              <span className="text-xs font-bold text-indigo-700">
                🔒 Mode Pantau Orang Tua
              </span>
            </div>
            <ParentDashboard onProgressUpdate={refreshProgress} />
          </div>
        ) : activeTab === 'portal' ? (
          /* 1. HALAMAN DEPAN / PORTAL AKTIVITAS (APP LAUNCHPAD) */
          progress && (
            <ActivityPortal
              progress={progress}
              onSelectActivity={(tab) => handleTabChange(tab)}
              onOpenParentMode={() => handleModeChange('parent')}
              onSwitchAccount={handleSwitchAccount}
            />
          )
        ) : (
          /* 2. DASHBOARD MODUL AKTIF DENGAN TOMBOL NAVIGASI BALIK KE MENU UTAMA */
          <div>
            {/* Navigasi Balik & Penanda Aktivitas Aktif */}
            <div className="flex items-center justify-between gap-3 mb-5 bg-white/90 backdrop-blur-sm border-2 border-amber-200/80 px-4 py-3 rounded-3xl shadow-sm">
              <button
                onClick={() => handleTabChange('portal')}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-200 transition btn-kids-pop cursor-pointer"
                title="Kembali ke layar Menu Utama / Portal"
              >
                <ArrowLeft className="w-4 h-4" />
                <HomeIcon className="w-4 h-4" />
                <span>Menu Utama</span>
              </button>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700">
                <span className="text-slate-400 hidden sm:inline">Aktivitas Sedang Dibuka:</span>
                <span className="bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-xl font-black border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                  <span>{currentTabInfo?.emoji}</span>
                  <span>{currentTabInfo?.label}</span>
                </span>
              </div>
            </div>

            {/* Banner Info Fitur Suara di dalam Modul */}
            <div className="bg-gradient-to-r from-amber-50/90 via-yellow-50/90 to-orange-50/90 backdrop-blur-sm border border-amber-200 rounded-2xl px-4 py-2.5 mb-6 flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs">
              <Volume2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>
                💡 <strong>Halo {progress?.childName || 'Sobat Cilik'}!</strong> Sentuh tombol audio atau kartu untuk mendengarkan pelafalan fonik.
              </span>
            </div>

            {/* Render Modul Terpilih */}
            {activeTab === 'alphabet' && <AlphabetModule onProgressUpdate={refreshProgress} />}
            {activeTab === 'syllables' && <SyllableModule onProgressUpdate={refreshProgress} />}
            {activeTab === 'words' && <WordReadingModule onProgressUpdate={refreshProgress} />}
            {activeTab === 'sentences' && <SentenceModule onProgressUpdate={refreshProgress} />}
            {activeTab === 'quiz' && <QuizArena onProgressUpdate={refreshProgress} />}
            {activeTab === 'stickers' && <StickerAlbum onProgressUpdate={refreshProgress} />}
          </div>
        )}
      </main>

      {/* Footer Ceria */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-amber-200/60 py-5 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-slate-600 font-bold">
            <span>RafaBintangBaca</span>
            <span className="text-amber-500">⭐</span>
            <span>- Akun: {progress?.childName} ({progress?.avatar})</span>
          </div>
          <div className="text-slate-400">
            Didesain khusus untuk stimulasi fonik anak usia Taman Kanak-Kanak.
          </div>
        </div>
      </footer>
    </div>
  );
}
