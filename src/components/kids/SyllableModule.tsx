'use client';

import React, { useState } from 'react';
import { SYLLABLE_GROUPS, SyllableGroup } from '@/data/curriculum';
import { speakSyllable, speakWord, speakText, stopSpeech } from '@/lib/speech';
import { playClickSound, playCorrectSound } from '@/lib/soundEffects';
import { markSyllableLearned, getProgress, UserProgress } from '@/lib/storage';
import { Volume2, Play, CheckCircle, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SyllableModuleProps {
  onProgressUpdate: () => void;
}

export default function SyllableModule({ onProgressUpdate }: SyllableModuleProps) {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [activeSyllable, setActiveSyllable] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentGroup: SyllableGroup = SYLLABLE_GROUPS[selectedGroupIdx];
  const progress: UserProgress = getProgress();

  const handlePlaySyllable = (syllable: string, sampleWord?: string) => {
    playClickSound();
    setActiveSyllable(syllable);
    speakSyllable(syllable, () => {
      setActiveSyllable(null);
    });
  };

  const handlePlaySampleWord = (sampleWord: string) => {
    playClickSound();
    speakWord(sampleWord);
  };

  // Mainkan berurutan: ba - bi - bu - be - bo
  const handleAutoPlayGroup = () => {
    stopSpeech();
    setIsAutoPlaying(true);
    let idx = 0;

    const runNext = () => {
      if (idx < currentGroup.syllables.length) {
        const item = currentGroup.syllables[idx];
        setActiveSyllable(item.syllable);
        speakSyllable(item.syllable, () => {
          idx++;
          setTimeout(runNext, 400);
        });
      } else {
        setActiveSyllable(null);
        setIsAutoPlaying(false);
      }
    };

    runNext();
  };

  const handleCompleteRow = () => {
    playCorrectSound();
    currentGroup.syllables.forEach((s) => markSyllableLearned(s.syllable));
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });
    onProgressUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Header Modul */}
      <div className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-500 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            Modul 2: Suku Kata Terbuka
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Belajar Membaca Suku Kata 🗣️
          </h2>
          <p className="text-sky-100 text-sm md:text-base mt-1">
            Klik suku kata untuk mendengarkan bunyinya. Gabungkan konsonan dengan huruf vokal!
          </p>
        </div>

        {/* Tombol Play All */}
        <button
          onClick={handleAutoPlayGroup}
          disabled={isAutoPlaying}
          className="px-5 py-3 rounded-2xl bg-white text-indigo-600 font-extrabold shadow-md hover:bg-indigo-50 transition flex items-center gap-2 btn-kids-pop disabled:opacity-50"
        >
          <Play className={`w-5 h-5 fill-indigo-600 ${isAutoPlaying ? 'animate-spin' : ''}`} />
          {isAutoPlaying ? 'Sedang Membacakan...' : 'Lafalkan Berurutan'}
        </button>
      </div>

      {/* Selector Konsonan */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SYLLABLE_GROUPS.map((group, idx) => {
          const isSelected = idx === selectedGroupIdx;
          const learnedCount = group.syllables.filter((s) =>
            progress.learnedSyllables.includes(s.syllable)
          ).length;

          return (
            <button
              key={group.consonant}
              onClick={() => {
                playClickSound();
                setSelectedGroupIdx(idx);
                stopSpeech();
                setIsAutoPlaying(false);
              }}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl font-black text-lg transition flex flex-col items-center min-w-[72px] btn-kids-pop ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-300'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              <span>{group.consonant}</span>
              <span className={`text-[10px] mt-0.5 font-semibold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                {learnedCount}/5 ⭐
              </span>
            </button>
          );
        })}
      </div>

      {/* Kartu Suku Kata 5 Vokal (a, i, u, e, o) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentGroup.syllables.map((item) => {
          const isLearned = progress.learnedSyllables.includes(item.syllable);
          const isActive = activeSyllable === item.syllable;

          return (
            <div
              key={item.syllable}
              onClick={() => handlePlaySyllable(item.syllable, item.sampleWord)}
              className={`cursor-pointer rounded-3xl p-5 border-3 transition shadow-sm hover:shadow-lg flex flex-col items-center text-center btn-kids-pop relative ${
                isActive
                  ? 'bg-amber-100 border-orange-500 ring-4 ring-orange-200 scale-105'
                  : 'bg-white border-sky-100 hover:border-sky-300'
              }`}
            >
              {isLearned && (
                <div className="absolute top-3 right-3 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              )}

              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Konsonan + {item.vowel.toUpperCase()}
              </span>

              {/* Suku Kata Besar dengan Warna Huruf Kontras */}
              <div className="my-2 text-5xl font-black tracking-wide">
                <span className="text-sky-600">{currentGroup.consonant.toLowerCase()}</span>
                <span className="text-rose-500">{item.vowel}</span>
              </div>

              {/* Tombol Speaker */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySyllable(item.syllable);
                }}
                className={`my-2 p-3 rounded-full transition flex items-center justify-center ${
                  isActive
                    ? 'bg-orange-500 text-white speaking-pulse'
                    : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                }`}
                title="Klik untuk mendengarkan bunyi suku kata"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {/* Contoh Kata */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySampleWord(item.sampleWord);
                }}
                className="mt-3 w-full bg-slate-50 hover:bg-slate-100 rounded-2xl p-2.5 flex items-center justify-center gap-2 border border-slate-100 transition"
              >
                <span className="text-2xl">{item.sampleEmoji}</span>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-700 capitalize">
                    {item.sampleWord}
                  </span>
                  <span className="block text-[10px] text-slate-400">klik dengar</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Penyelesaian Modul */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
            🏆
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-lg">
              Sudah Lancar Membaca Deret "{currentGroup.consonant}"?
            </h4>
            <p className="text-slate-500 text-sm">
              Latih terus dengan menekan tombol suara sampai terbiasa, lalu tandai selesai!
            </p>
          </div>
        </div>

        <button
          onClick={handleCompleteRow}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 btn-kids-pop"
        >
          <CheckCircle className="w-5 h-5" />
          Hafal Deret {currentGroup.consonant} (+5 ⭐)
        </button>
      </div>
    </div>
  );
}
