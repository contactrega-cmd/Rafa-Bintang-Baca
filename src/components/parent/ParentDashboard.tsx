'use client';

import React, { useState } from 'react';
import {
  getProgress,
  saveProgress,
  resetProgress,
  ANIMAL_CHARACTERS,
  UserProgress,
} from '@/lib/storage';
import { ALPHABET_DATA, SYLLABLE_GROUPS, READING_WORDS } from '@/data/curriculum';
import { speakText, stopSpeech } from '@/lib/speech';
import { playClickSound, playCorrectSound } from '@/lib/soundEffects';
import {
  BarChart3,
  BookOpen,
  Volume2,
  Clock,
  RotateCcw,
  Settings,
  TrendingUp,
  Award,
  Lightbulb,
  Save,
  Type,
} from 'lucide-react';

interface ParentDashboardProps {
  onProgressUpdate: () => void;
}

export default function ParentDashboard({ onProgressUpdate }: ParentDashboardProps) {
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [editingName, setEditingName] = useState(progress.childName);
  const [selectedAvatar, setSelectedAvatar] = useState(progress.avatar);
  const speechRate = 0.55;
  const selectedFont = 'jakarta';
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const totalLetters = ALPHABET_DATA.length;
  const learnedLettersCount = progress.learnedLetters.length;
  const letterPercentage = Math.round((learnedLettersCount / totalLetters) * 100);

  const totalSyllables = SYLLABLE_GROUPS.reduce((acc, g) => acc + g.syllables.length, 0);
  const learnedSyllablesCount = progress.learnedSyllables.length;
  const syllablePercentage = Math.round((learnedSyllablesCount / totalSyllables) * 100);

  const totalWords = READING_WORDS.length;
  const learnedWordsCount = progress.learnedWords.length;
  const wordPercentage = Math.round((learnedWordsCount / totalWords) * 100);

  // Simpan Pengaturan
  const handleSaveSettings = () => {
    playCorrectSound();
    const updated: UserProgress = {
      ...progress,
      childName: editingName.trim() || 'Rafa',
      avatar: selectedAvatar,
      speechRate: 0.55,
      fontFamily: 'jakarta',
    };
    saveProgress(updated);
    setProgress(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
    onProgressUpdate();
  };

  // Uji Coba Suara
  const handleTestSpeech = () => {
    playClickSound();
    stopSpeech();
    speakText('Halo Ayah dan Bunda! Suara pelafalan membaca sudah siap digunakan pada tempo pelan.', {
      rate: 0.55,
    });
  };

  // Reset Data
  const handleResetData = () => {
    const confirmReset = window.confirm(
      'Apakah Ayah/Bunda yakin ingin mengatur ulang data kemajuan belajar anak?'
    );
    if (confirmReset) {
      playClickSound();
      resetProgress();
      const fresh = getProgress();
      setProgress(fresh);
      setEditingName(fresh.childName);
      setSelectedAvatar(fresh.avatar);
      onProgressUpdate();
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner Atas Dashboard */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-4xl shadow-inner">
            {progress.avatar}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-3 py-0.5 rounded-full text-xs font-semibold text-indigo-200 mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              Dashboard Pemantauan Orang Tua & Guru
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Perkembangan Belajar: {progress.childName}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Pantau kemahiran membaca huruf, suku kata, dan skor latihan harian anak secara terukur.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
          <div className="text-center">
            <span className="block text-2xl font-black text-amber-400">{progress.stars}</span>
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total ⭐</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <span className="block text-2xl font-black text-emerald-400">{progress.dailyPracticeMinutes} m</span>
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Latihan Hari Ini</span>
          </div>
        </div>
      </div>

      {/* Grid Statistik Penguasaan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Modul 1: Huruf */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-black">
              Aa
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
              {letterPercentage}% Tuntas
            </span>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-800">Pengenalan Huruf</h4>
            <p className="text-xs text-slate-500 mb-3">Alfabet A sampai Z & Bunyi Vokal</p>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${letterPercentage}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex justify-between">
            <span>Dikuasai:</span>
            <span className="font-bold text-slate-800">{learnedLettersCount} dari {totalLetters} huruf</span>
          </div>
        </div>

        {/* Modul 2: Suku Kata */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg font-black">
              ba
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
              {syllablePercentage}% Tuntas
            </span>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-800">Suku Kata Terbuka</h4>
            <p className="text-xs text-slate-500 mb-3">Kombinasi konsonan + a, i, u, e, o</p>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${syllablePercentage}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex justify-between">
            <span>Dikuasai:</span>
            <span className="font-bold text-slate-800">{learnedSyllablesCount} dari {totalSyllables} suku kata</span>
          </div>
        </div>

        {/* Modul 3: Kata Bergambar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-black">
              baju
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">
              {wordPercentage}% Tuntas
            </span>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-800">Membaca Kata</h4>
            <p className="text-xs text-slate-500 mb-3">Kata 2 dan 3 suku kata bergambar</p>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${wordPercentage}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex justify-between">
            <span>Dikuasai:</span>
            <span className="font-bold text-slate-800">{learnedWordsCount} dari {totalWords} kata</span>
          </div>
        </div>
      </div>

      {/* Bagian Riwayat Kuis & Tips Pedagogi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Riwayat Kuis */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Riwayat Kuis & Latihan Mandiri
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Terbaru ({progress.quizHistory.length} sesi)
            </span>
          </div>

          {progress.quizHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Belum ada riwayat kuis. Ajak anak mencoba mini game di Arena Bermain!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-bold">
                    <th className="pb-3">Tanggal</th>
                    <th className="pb-3">Jenis Kuis</th>
                    <th className="pb-3 text-center">Skor</th>
                    <th className="pb-3 text-right">Akurasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {progress.quizHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 font-semibold text-slate-600">{item.date}</td>
                      <td className="py-3 font-bold text-slate-800">{item.gameType}</td>
                      <td className="py-3 text-center font-black text-indigo-600">
                        {item.score}/{item.totalQuestions}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                            item.accuracy >= 80
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.accuracy >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.accuracy}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Tips Bimbingan Belajar Membaca TK */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-base mb-3">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              Tips Membimbing Anak TK
            </div>
            <ul className="space-y-3 text-xs md:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>
                  <strong>Bentuk Huruf Jelas:</strong> Menggunakan font edukasi seperti <em>Plus Jakarta Sans</em> membantu anak membedakan bentuk huruf yang mirip (seperti b, d, p, q) secara rapi dan tegas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>
                  <strong>Gunakan Suara Berulang:</strong> Biarkan anak menekan tombol audio suku kata beberapa kali sampai artikulasi bunyinya melekat kuat.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>
                  <strong>Latihan Singkat Namun Rutin:</strong> Durasi 10–15 menit per sesi setiap hari jauh lebih efektif untuk usia TK dibanding sesi panjang.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-amber-200/70 text-center">
            <span className="text-[11px] font-bold text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full">
              Pujian & Apresiasi adalah Kunci Semangat Anak! ❤️
            </span>
          </div>
        </div>
      </div>

      {/* Pengaturan Profil Anak & Audio */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600" />
          Pengaturan Profil Anak & Pengujian Audio
        </h3>

        {/* Informasi Standar Edukasi: Font & Tempo */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white mt-0.5">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase">Font Huruf Standar:</span>
              <strong className="text-sm font-black text-indigo-950 block">Plus Jakarta Sans (Aktif)</strong>
              <span className="text-[11px] text-slate-600">Bentuk kurva simetris, bersih, bebas gaya komik, sangat nyaman untuk mata anak.</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white mt-0.5">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase">Tempo Pelafalan Suara:</span>
              <strong className="text-sm font-black text-amber-950 block">0.55x (Sangat Pelan & Jelas)</strong>
              <span className="text-[11px] text-slate-600">Artikulasi vokal & konsonan diucapkan santai agar mudah ditirukan anak TK.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Profil Anak */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Nama Panggilan Anak:
              </label>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-bold text-slate-800"
                placeholder="Contoh: Rafa / Aisyah"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                Pilih Karakter Maskot Hewan:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ANIMAL_CHARACTERS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.emoji)}
                    className={`p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 transition ${
                      selectedAvatar === av.emoji
                        ? 'border-indigo-500 bg-indigo-50 font-bold text-indigo-700 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                    <span className="text-xs">{av.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pengujian Audio & Aksi */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                Uji Pelafalan Suara:
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Tekan tombol di bawah untuk mendengarkan kejernihan pelafalan audio bahasa Indonesia pada tempo 0.55x.
              </p>
              {/* Tombol Uji Coba Suara */}
              <button
                type="button"
                onClick={handleTestSpeech}
                className="w-full py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center gap-2 border border-indigo-200 transition btn-kids-pop"
              >
                <Volume2 className="w-4 h-4" /> Uji Coba Suara Pelafalan Bahasa Indonesia (0.55x)
              </button>
            </div>

            {/* Tombol Uji Coba Suara */}
            <button
              type="button"
              onClick={handleTestSpeech}
              className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 border border-indigo-200 transition"
            >
              <Volume2 className="w-4 h-4" /> Uji Coba Suara Pelafalan Bahasa Indonesia
            </button>

            {/* Tombol Simpan & Notifikasi */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-100 btn-kids-pop"
              >
                <Save className="w-4 h-4" /> Simpan Pengaturan
              </button>

              <button
                type="button"
                onClick={handleResetData}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold text-xs flex items-center gap-1.5 transition"
                title="Atur ulang semua data kemajuan"
              >
                <RotateCcw className="w-4 h-4" /> Reset Data
              </button>
            </div>

            {isSavedNotice && (
              <p className="text-center text-xs font-bold text-emerald-600 animate-in fade-in">
                ✓ Pengaturan berhasil disimpan!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
