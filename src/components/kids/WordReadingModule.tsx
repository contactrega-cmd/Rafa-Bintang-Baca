'use client';

import React, { useState } from 'react';
import { READING_WORDS, ReadingWord } from '@/data/curriculum';
import { speakWord, speakSyllable, spellAndSpeakWord, stopSpeech } from '@/lib/speech';
import { playClickSound, playCorrectSound } from '@/lib/soundEffects';
import { markWordLearned, getProgress, UserProgress } from '@/lib/storage';
import { Volume2, Sparkles, CheckCircle, Star, Filter, Music, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordReadingModuleProps {
  onProgressUpdate: () => void;
}

export default function WordReadingModule({ onProgressUpdate }: WordReadingModuleProps) {
  const [levelFilter, setLevelFilter] = useState<1 | 2>(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeSpeakingWordId, setActiveSpeakingWordId] = useState<string | null>(null);
  const [highlightedSyllableIdx, setHighlightedSyllableIdx] = useState<{ wordId: string; idx: number | null } | null>(null);

  const progress: UserProgress = getProgress();

  const wordsInCurrentLevel = READING_WORDS.filter((item) => item.level === levelFilter);
  const level1Count = READING_WORDS.filter((item) => item.level === 1).length;
  const level2Count = READING_WORDS.filter((item) => item.level === 2).length;

  const filteredWords = wordsInCurrentLevel.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    return true;
  });

  const CATEGORY_ITEMS = [
    { id: 'all', label: 'Semua', emoji: '🌟', count: wordsInCurrentLevel.length },
    { id: 'benda', label: 'Benda', emoji: '👕', count: wordsInCurrentLevel.filter((w) => w.category === 'benda').length },
    { id: 'hewan', label: 'Hewan', emoji: '🐴', count: wordsInCurrentLevel.filter((w) => w.category === 'hewan').length },
    { id: 'makanan', label: 'Makanan', emoji: '🍎', count: wordsInCurrentLevel.filter((w) => w.category === 'makanan').length },
    { id: 'tubuh', label: 'Tubuh', emoji: '👀', count: wordsInCurrentLevel.filter((w) => w.category === 'tubuh').length },
  ];

  // Fitur Klik Suara per Suku Kata
  const handleSyllableClick = (wordId: string, syllable: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setHighlightedSyllableIdx({ wordId, idx });
    speakSyllable(syllable, () => {
      setHighlightedSyllableIdx(null);
    });
  };

  // Fitur Dengar Cara Baca Lengkap (Eja Suku Kata lalu Kata Utuh)
  const handlePlayFullSpelling = (item: ReadingWord) => {
    stopSpeech();
    playClickSound();
    setActiveSpeakingWordId(item.id);

    spellAndSpeakWord(
      item.syllables,
      item.word,
      (idx) => {
        setHighlightedSyllableIdx({ wordId: item.id, idx });
      },
      () => {
        setActiveSpeakingWordId(null);
        setHighlightedSyllableIdx(null);
      }
    );
  };

  // Fitur Suara Kata Langsung
  const handlePlayDirectWord = (item: ReadingWord, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setActiveSpeakingWordId(item.id);
    speakWord(item.word, () => {
      setActiveSpeakingWordId(null);
    });
  };

  const handleMarkLearned = (item: ReadingWord) => {
    if (progress.learnedWords.includes(item.word)) return;
    playCorrectSound();
    markWordLearned(item.word);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    onProgressUpdate();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'benda':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'hewan':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'makanan':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'tubuh':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Modul */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            Modul 3: Membaca Kata Bergambar ({READING_WORDS.length} Kata)
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Membaca Kata & Belajar Ejaan 📖
          </h2>
          <p className="text-teal-100 text-sm md:text-base mt-1">
            Klik balok warna untuk mengeja suku kata satu per satu, atau tekan speaker untuk mendengar cara baca lengkapnya!
          </p>
        </div>

        {/* Info Progres & Pilihan Level */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-yellow-300" />
            <div className="text-right">
              <span className="text-xs text-teal-100 block">Dikuasai</span>
              <span className="font-extrabold text-sm text-white">
                {progress.learnedWords.length} / {READING_WORDS.length} Kata
              </span>
            </div>
          </div>

          <div className="flex bg-black/20 p-1.5 rounded-2xl gap-1">
            <button
              onClick={() => {
                playClickSound();
                setLevelFilter(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                levelFilter === 1 ? 'bg-white text-teal-700 shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              2 Suku Kata ({level1Count})
            </button>
            <button
              onClick={() => {
                playClickSound();
                setLevelFilter(2);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                levelFilter === 2 ? 'bg-white text-teal-700 shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              3 Suku Kata ({level2Count})
            </button>
          </div>
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm scrollbar-none">
        <span className="text-slate-400 font-bold flex items-center gap-1 pl-1 whitespace-nowrap">
          <Filter className="w-4 h-4" /> Kategori:
        </span>
        {CATEGORY_ITEMS.map((cat) => {
          const isActive = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playClickSound();
                setCategoryFilter(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold capitalize transition whitespace-nowrap btn-kids-pop ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Kartu Kata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWords.map((item) => {
          const isLearned = progress.learnedWords.includes(item.word);
          const isSpeakingThis = activeSpeakingWordId === item.id;
          const categoryStyle = getCategoryColor(item.category);

          // Warna warni balok suku kata
          const syllableBgColors = [
            'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
            'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
            'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100',
          ];

          return (
            <div
              key={item.id}
              className={`rounded-3xl p-5 bg-white border-2 transition shadow-sm hover:shadow-lg flex flex-col justify-between relative ${
                isSpeakingThis
                  ? 'border-teal-500 ring-4 ring-teal-100'
                  : isLearned
                  ? 'border-emerald-200 bg-emerald-50/15'
                  : 'border-slate-100 hover:border-teal-200'
              }`}
            >
              {/* Badge Kategori & Bintang */}
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryStyle}`}>
                  {item.category}
                </span>

                {isLearned && (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> Hafal
                  </span>
                )}
              </div>

              {/* Gambar / Ilustrasi */}
              <div className="flex flex-col items-center justify-center my-2">
                <div className="text-6xl mb-3 transform hover:scale-110 transition duration-150 select-none">
                  {item.emoji}
                </div>

                {/* Balok Suku Kata Interaktif (Bisa Diklik Satu Per Satu) */}
                <div className="flex items-center gap-2 mb-3">
                  {item.syllables.map((syl, sIdx) => {
                    const isSyllableActive =
                      highlightedSyllableIdx?.wordId === item.id &&
                      highlightedSyllableIdx.idx === sIdx;

                    return (
                      <button
                        key={sIdx}
                        onClick={(e) => handleSyllableClick(item.id, syl, sIdx, e)}
                        title={`Klik untuk mendengarkan bunyi "${syl}"`}
                        className={`px-4 py-2.5 rounded-2xl font-black text-2xl tracking-wide border-2 transition btn-kids-pop ${
                          isSyllableActive
                            ? 'bg-amber-400 text-slate-900 border-amber-500 scale-110 shadow-lg'
                            : syllableBgColors[sIdx % syllableBgColors.length]
                        }`}
                      >
                        {syl}
                      </button>
                    );
                  })}
                </div>

                {/* Petunjuk Eja Bunyi */}
                <p className="text-xs text-slate-400 font-medium">
                  Sentuh tiap kotak untuk mengeja suku kata
                </p>
              </div>

              {/* Tombol Audio & Aksi */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {/* Tombol Dengar Cara Baca Lengkap */}
                <button
                  onClick={() => handlePlayFullSpelling(item)}
                  className={`w-full py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition btn-kids-pop ${
                    isSpeakingThis
                      ? 'bg-teal-600 text-white speaking-pulse'
                      : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  {isSpeakingThis ? 'Membacakan...' : 'Dengar Cara Baca Lengkap'}
                </button>

                <div className="flex gap-2">
                  {/* Tombol Langsung Baca Utuh */}
                  <button
                    onClick={(e) => handlePlayDirectWord(item, e)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center gap-1.5 transition"
                    title="Dengar pengucapan kata langsung"
                  >
                    <Music className="w-3.5 h-3.5 text-teal-500" />
                    Kata Utuh
                  </button>

                  {/* Tombol Aku Sudah Bisa */}
                  <button
                    onClick={() => handleMarkLearned(item)}
                    disabled={isLearned}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      isLearned
                        ? 'bg-emerald-100 text-emerald-700 cursor-default shadow-none'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm btn-kids-pop'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isLearned ? 'Sudah Bisa ✓' : 'Bisa Baca (+2 ⭐)'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
