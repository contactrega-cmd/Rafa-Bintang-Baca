'use client';

import React, { useState } from 'react';
import { SIMPLE_SENTENCES, SimpleSentence } from '@/data/curriculum';
import { speakWord, speakText, stopSpeech } from '@/lib/speech';
import { playClickSound, playCorrectSound } from '@/lib/soundEffects';
import { markSentenceLearned, getProgress, UserProgress } from '@/lib/storage';
import { Volume2, Sparkles, CheckCircle, Award, Star, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SentenceModuleProps {
  onProgressUpdate: () => void;
}

export default function SentenceModule({ onProgressUpdate }: SentenceModuleProps) {
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [highlightedWordIdx, setHighlightedWordIdx] = useState<{ sentenceId: string; idx: number | null } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const progress: UserProgress = getProgress();
  const completedSentences = progress.learnedSentences || [];

  const CATEGORIES = [
    { id: 'all', label: 'Semua', emoji: '🌟', count: SIMPLE_SENTENCES.length },
    { id: 'keluarga', label: 'Keluarga', emoji: '👨‍👩‍👧', count: SIMPLE_SENTENCES.filter((s) => s.category === 'keluarga').length },
    { id: 'hewan', label: 'Hewan', emoji: '🐱', count: SIMPLE_SENTENCES.filter((s) => s.category === 'hewan').length },
    { id: 'makanan', label: 'Makanan', emoji: '🍎', count: SIMPLE_SENTENCES.filter((s) => s.category === 'makanan').length },
    { id: 'aktivitas', label: 'Aktivitas', emoji: '⚽', count: SIMPLE_SENTENCES.filter((s) => s.category === 'aktivitas').length },
    { id: 'lingkungan', label: 'Lingkungan', emoji: '🏡', count: SIMPLE_SENTENCES.filter((s) => s.category === 'lingkungan').length },
  ];

  const filteredSentences = SIMPLE_SENTENCES.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  // Klik kata individual
  const handleWordClick = (sentenceId: string, word: string, idx: number) => {
    playClickSound();
    setHighlightedWordIdx({ sentenceId, idx });
    speakWord(word, () => {
      setHighlightedWordIdx(null);
    });
  };

  // Baca seluruh kalimat dengan tempo pelan ramah anak (0.55x)
  const handlePlaySentence = (item: SimpleSentence) => {
    stopSpeech();
    playClickSound();
    setActiveSpeakingId(item.id);

    speakText(item.sentence, { rate: 0.55 }, () => {
      setActiveSpeakingId(null);
      setHighlightedWordIdx(null);
    });
  };

  const handleCompleteSentence = (sentenceId: string) => {
    if (completedSentences.includes(sentenceId)) return;
    playCorrectSound();
    markSentenceLearned(sentenceId);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 },
    });
    onProgressUpdate();
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'keluarga':
        return { label: 'Keluarga', color: 'bg-pink-100 text-pink-700' };
      case 'hewan':
        return { label: 'Hewan', color: 'bg-emerald-100 text-emerald-700' };
      case 'makanan':
        return { label: 'Makanan', color: 'bg-amber-100 text-amber-700' };
      case 'aktivitas':
        return { label: 'Aktivitas', color: 'bg-sky-100 text-sky-700' };
      case 'lingkungan':
        return { label: 'Lingkungan', color: 'bg-violet-100 text-violet-700' };
      default:
        return { label: 'Kalimat', color: 'bg-purple-100 text-purple-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Modul */}
      <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            Modul 4: Membaca Kalimat Sederhana (30 Kalimat)
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Latihan Membaca Kalimat Pendek 🌟
          </h2>
          <p className="text-purple-100 text-sm md:text-base mt-1">
            Sentuh tiap kata untuk membacanya, lalu dengarkan pengucapan kalimat secara utuh!
          </p>
        </div>

        {/* Status Kemajuan Baca Kalimat */}
        <div className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-xl text-slate-900 shadow">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-purple-100 font-medium">Progres Membaca</div>
            <div className="text-lg font-black text-white">
              {completedSentences.length} / {SIMPLE_SENTENCES.length} <span className="text-xs font-normal text-purple-200">Lancar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Filter Tab */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playClickSound();
                setCategoryFilter(cat.id);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition btn-kids-pop ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200 scale-105'
                  : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Daftar Kalimat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSentences.map((item) => {
          const originalIndex = SIMPLE_SENTENCES.findIndex((s) => s.id === item.id);
          const isCompleted = completedSentences.includes(item.id);
          const isSpeakingThis = activeSpeakingId === item.id;
          const badge = getCategoryBadge(item.category);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 border-2 transition shadow-sm hover:shadow-md flex flex-col justify-between relative ${
                isSpeakingThis
                  ? 'border-purple-500 ring-4 ring-purple-100'
                  : isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-100 hover:border-purple-200'
              }`}
            >
              <div>
                {/* Baris Atas: Nomor Kalimat, Kategori, dan Emoji Ilustrasi */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                      Kalimat #{originalIndex + 1}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <span className="text-3xl">{item.meaningEmoji}</span>
                </div>

                {/* Balok Kata-kata dalam Kalimat */}
                <div className="flex flex-wrap items-center gap-2 my-4">
                  {item.words.map((w, wIdx) => {
                    const isWordActive =
                      highlightedWordIdx?.sentenceId === item.id &&
                      highlightedWordIdx.idx === wIdx;

                    return (
                      <button
                        key={wIdx}
                        onClick={() => handleWordClick(item.id, w.word, wIdx)}
                        className={`px-4 py-2.5 rounded-2xl text-xl md:text-2xl font-black capitalize transition btn-kids-pop ${
                          isWordActive
                            ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-800'
                        }`}
                        title="Klik untuk mendengar kata ini"
                      >
                        {w.word}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Audio & Selesai */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => handlePlaySentence(item)}
                  className={`flex-1 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition btn-kids-pop ${
                    isSpeakingThis
                      ? 'bg-purple-600 text-white speaking-pulse'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  {isSpeakingThis ? 'Membacakan...' : 'Dengar Kalimat'}
                </button>

                <button
                  onClick={() => handleCompleteSentence(item.id)}
                  disabled={isCompleted}
                  className={`px-4 py-3 rounded-2xl text-sm font-extrabold flex items-center gap-1.5 transition ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700 cursor-default shadow-none'
                      : 'bg-amber-500 hover:bg-amber-600 text-white btn-kids-pop shadow-sm'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Lancar!
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" /> Sudah Bisa (+3 ⭐)
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
