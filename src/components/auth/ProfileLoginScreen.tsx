'use client';

import React, { useState, useEffect } from 'react';
import {
  getAllProfiles,
  createProfile,
  deleteProfile,
  setActiveProfileId,
  ANIMAL_CHARACTERS,
  UserProgress,
} from '@/lib/storage';
import { speakText, stopSpeech } from '@/lib/speech';
import { playClickSound, playCelebrationSound } from '@/lib/soundEffects';
import {
  Star,
  Plus,
  Sparkles,
  Smile,
  Check,
  Trash2,
  BookOpen,
  ArrowRight,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileLoginScreenProps {
  onSelectProfile: (profile: UserProgress) => void;
}

export default function ProfileLoginScreen({ onSelectProfile }: ProfileLoginScreenProps) {
  const [profiles, setProfiles] = useState<UserProgress[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [selectedAnimalId, setSelectedAnimalId] = useState(ANIMAL_CHARACTERS[0].id);

  useEffect(() => {
    const list = getAllProfiles();
    setProfiles(list);
    setIsLoaded(true);
    if (list.length === 0) {
      setIsCreating(true);
    }
  }, []);

  const refreshProfilesList = () => {
    const list = getAllProfiles();
    setProfiles(list);
    if (list.length === 0) {
      setIsCreating(true);
    }
  };

  const handleChooseProfile = (profile: UserProgress) => {
    playCelebrationSound();
    setActiveProfileId(profile.id);

    // Sambutan audio personal untuk anak
    stopSpeech();
    speakText(`Halo ${profile.childName}! Ayo kita belajar membaca bersama!`);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      onSelectProfile(profile);
    }, 450);
  };

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    playCelebrationSound();
    const created = createProfile(newChildName, selectedAnimalId);
    refreshProfilesList();

    const selectedAnimal = ANIMAL_CHARACTERS.find((a) => a.id === selectedAnimalId);

    // Audio sambutan pembuatan profil
    stopSpeech();
    speakText(
      `Selamat datang ${created.childName}! Karaktermu adalah ${selectedAnimal?.name || 'Sahabat Pintar'}!`
    );

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
    });

    setIsCreating(false);
    setNewChildName('');
    onSelectProfile(created);
  };

  const handleDeleteProfile = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus profil "${name}"? Semua kemajuan bintang akan dihapus.`
    );
    if (confirmDelete) {
      playClickSound();
      deleteProfile(id);
      refreshProfilesList();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 relative z-10 select-none">
      {/* Container Utama */}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-2 border-amber-200 shadow-xl text-center">
        {/* Logo & Judul Ceria */}
        <div className="inline-flex items-center gap-2.5 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-200">
            <Star className="w-7 h-7 fill-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            RafaBintang<span className="text-orange-500">Baca</span>
          </h1>
        </div>

        <p className="text-slate-500 text-sm sm:text-base font-semibold max-w-md mx-auto mb-8">
          Selamat datang! Pilih akun kamu untuk mulai berpetualang dan mengumpulkan bintang membaca.
        </p>

        {/* JIKA SEDANG DALAM MODE PILIH PROFIL */}
        {!isCreating ? (
          <div>
            {profiles.length === 0 ? (
              /* Tampilan Jika Belum Ada Akun */
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 text-3xl shadow-inner">
                  🌱
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-1">
                  Belum Ada Akun Terdaftar
                </h2>
                <p className="text-slate-500 text-sm max-w-sm mb-6">
                  Yuk buat akun anak pertama untuk memulai petualangan belajar membaca dari 0 bintang!
                </p>
                <button
                  onClick={() => {
                    playClickSound();
                    setIsCreating(true);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-200 flex items-center gap-2 transition btn-kids-pop"
                >
                  <Plus className="w-5 h-5" /> Buat Akun Pertama
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                    <Smile className="w-5 h-5 text-orange-500" />
                    Siapa yang Mau Belajar Hari Ini?
                  </h2>

                  <button
                    onClick={() => {
                      playClickSound();
                      setIsCreating(true);
                    }}
                    className="px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-200 flex items-center gap-1.5 transition btn-kids-pop"
                  >
                    <Plus className="w-4 h-4" /> Tambah Akun
                  </button>
                </div>

                {/* Grid Daftar Profil Anak */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => handleChooseProfile(profile)}
                      className="rounded-3xl p-5 bg-white border-2 border-slate-200 hover:border-orange-400 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center text-center btn-kids-pop relative group"
                    >
                      {/* Tombol Hapus Profil (Selalu aktif dan bisa menghapus profil apa pun) */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteProfile(profile.id, profile.childName, e)}
                        title={`Hapus akun "${profile.childName}"`}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition shadow-xs z-10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Avatar Hewan Besar */}
                      <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl mb-3 shadow-inner group-hover:scale-105 transition">
                        {profile.avatar}
                      </div>

                      {/* Nama Anak */}
                      <h3 className="text-xl font-black text-slate-800 mb-0.5">
                        {profile.childName}
                      </h3>

                      {/* Label Karakter Hewan */}
                      <span className="text-xs font-semibold text-slate-500 mb-3">
                        {profile.animalLabel || 'Sahabat Pintar'}
                      </span>

                      {/* Badge Bintang */}
                      <div className="mt-auto inline-flex items-center gap-1.5 bg-yellow-400 text-slate-900 px-3.5 py-1 rounded-full text-xs font-black shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-slate-900" />
                        <span>{profile.stars} Bintang</span>
                      </div>

                      {/* Tombol Masuk */}
                      <button
                        onClick={() => handleChooseProfile(profile)}
                        className="mt-4 w-full py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <span>Pilih Akun Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Kartu Tombol Tambah Akun Baru */}
                  <div
                    onClick={() => {
                      playClickSound();
                      setIsCreating(true);
                    }}
                    className="rounded-3xl p-6 border-2 border-dashed border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/40 transition cursor-pointer flex flex-col items-center justify-center min-h-[220px] text-center btn-kids-pop"
                  >
                    <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
                      <Plus className="w-7 h-7" />
                    </div>
                    <span className="font-extrabold text-slate-700 text-sm">
                      Buat Akun Baru
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Tambah nama anak & pilih karakter hewan
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* JIKA DALAM FORM PEMBUATAN AKUN BARU */
          <form onSubmit={handleCreateProfileSubmit} className="text-left space-y-6 max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                {profiles.length === 0 ? 'Buat Akun Anak Pertama Kamu! 🎨' : 'Buat Akun Anak Baru 🎨'}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                {profiles.length === 0
                  ? 'Mulai petualangan dari langkah pertama! Tulis nama anak dan pilih karakter hewan kesukaannya.'
                  : 'Tulis nama anak dan pilih karakter hewan yang paling cocok!'}
              </p>
            </div>

            {/* Input Nama Anak */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                1. Siapa Nama Panggilan Anak?
              </label>
              <input
                type="text"
                required
                autoFocus
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Contoh: Rafa / Aisyah / Kenzo"
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-amber-300 focus:outline-none focus:border-orange-500 text-lg font-black text-slate-800 shadow-sm"
              />
            </div>

            {/* Pilihan Karakter Hewan */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                2. Pilih Karakter Hewan Kesukaan:
              </label>

              <div className="grid grid-cols-3 gap-3">
                {ANIMAL_CHARACTERS.map((animal) => {
                  const isSelected = selectedAnimalId === animal.id;

                  return (
                    <button
                      key={animal.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedAnimalId(animal.id);
                      }}
                      className={`p-3 rounded-2xl border-2 transition flex flex-col items-center text-center btn-kids-pop relative ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}

                      <span className="text-3xl sm:text-4xl mb-1.5">{animal.emoji}</span>
                      <span className="text-xs font-extrabold text-slate-800">
                        {animal.name}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {animal.trait}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tombol Aksi Form */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setIsCreating(false);
                  }}
                  className="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition"
                >
                  Batal
                </button>
              )}

              <button
                type="submit"
                disabled={!newChildName.trim()}
                className={`${
                  profiles.length > 0 ? 'w-2/3' : 'w-full'
                } py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-base shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition btn-kids-pop`}
              >
                <span>{profiles.length === 0 ? 'Mulai Belajar Membaca! 🚀' : 'Mulai Belajar! 🎉'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
