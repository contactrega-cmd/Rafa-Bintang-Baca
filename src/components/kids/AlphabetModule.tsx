'use client';

import React, { useState } from 'react';
import { ALPHABET_DATA, LetterItem } from '@/data/curriculum';
import { speakLetter, speakWord, speakText } from '@/lib/speech';
import { playClickSound, playCorrectSound } from '@/lib/soundEffects';
import { markLetterLearned, getProgress, UserProgress } from '@/lib/storage';
import { Volume2, Star, CheckCircle, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AlphabetModuleProps {
  onProgressUpdate: () => void;
}

export default function AlphabetModule({ onProgressUpdate }: AlphabetModuleProps) {
  const [filter, setFilter] = useState<'all' | 'vowel' | 'consonant'>('all');
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const progress: UserProgress = getProgress();

  const filteredLetters = ALPHABET_DATA.filter((item) => {
    if (filter === 'vowel') return item.isVowel;
    if (filter === 'consonant') return !item.isVowel;
    return true;
  });

  const handlePlayLetterSound = (item: LetterItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound();
    setIsSpeaking(item.letter);
    speakLetter(item.letter, item.soundCue, () => {
      setIsSpeaking(null);
    });
  };

  const handlePlayWordSound = (item: LetterItem) => {
    playClickSound();
    setIsSpeaking(item.word);
    speakWord(item.word, () => {
      setIsSpeaking(null);
    });
  };

  const handleCardClick = (item: LetterItem) => {
    setSelectedLetter(item);
    handlePlayLetterSound(item);
  };

  const handleMarkLearned = (item: LetterItem) => {
    playCorrectSound();
    markLetterLearned(item.letter);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    onProgressUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Header Modul */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            Modul 1: Mengenal Alfabet
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Sentuh Huruf untuk Mendengarkan Suaranya! 🔤
          </h2>
          <p className="text-amber-100 text-sm md:text-base mt-1">
            Klik kartu huruf untuk mendengarkan cara baca yang benar, lalu kenali bendanya.
          </p>
        </div>

        {/* Tombol Filter */}
        <div className="flex bg-black/15 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => {
              playClickSound();
              setFilter('all');
            }}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition ${
              filter === 'all' ? 'bg-white text-orange-600 shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            Semua (A-Z)
          </button>
          <button
            onClick={() => {
              playClickSound();
              setFilter('vowel');
            }}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition ${
              filter === 'vowel' ? 'bg-white text-orange-600 shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            Vokal (A, I, U, E, O)
          </button>
          <button
            onClick={() => {
              playClickSound();
              setFilter('consonant');
            }}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition ${
              filter === 'consonant' ? 'bg-white text-orange-600 shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            Konsonan
          </button>
        </div>
      </div>

      {/* Grid Huruf */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredLetters.map((item) => {
          const isLearned = progress.learnedLetters.includes(item.letter);
          const isCurrentSpeaking = isSpeaking === item.letter;

          return (
            <div
              key={item.letter}
              onClick={() => handleCardClick(item)}
              className={`btn-kids-pop cursor-pointer relative rounded-3xl p-4 bg-white border-2 transition shadow-sm hover:shadow-md flex flex-col items-center justify-between min-h-[160px] ${
                isCurrentSpeaking
                  ? 'border-orange-500 ring-4 ring-orange-200'
                  : 'border-slate-100 hover:border-orange-300'
              }`}
            >
              {/* Status Badge */}
              <div className="w-full flex justify-between items-center mb-1">
                {item.isVowel ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                    Vokal
                  </span>
                ) : (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    Huruf
                  </span>
                )}

                {isLearned && (
                  <span className="text-amber-500 flex items-center gap-0.5 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </span>
                )}
              </div>

              {/* Huruf Besar & Kecil */}
              <div className="text-center my-1">
                <span className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                  {item.letter}
                </span>
                <span className="text-2xl md:text-3xl font-bold text-slate-400 ml-1">
                  {item.letter.toLowerCase()}
                </span>
              </div>

              {/* Benda Asosiasi */}
              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full text-slate-700 text-xs font-semibold">
                <span className="text-base">{item.emoji}</span>
                <span>{item.word}</span>
              </div>

              {/* Tombol Speaker Suara */}
              <button
                onClick={(e) => handlePlayLetterSound(item, e)}
                title="Klik untuk mendengarkan suara"
                className={`mt-2 p-2 rounded-full transition flex items-center justify-center ${
                  isCurrentSpeaking
                    ? 'bg-orange-500 text-white speaking-pulse'
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Detail & Latihan Pengucapan Huruf */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-200 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Tombol Tutup */}
            <button
              onClick={() => {
                playClickSound();
                setSelectedLetter(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                {selectedLetter.isVowel ? '🌟 Huruf Vokal' : '✨ Huruf Konsonan'}
              </div>

              {/* Tampilan Huruf Raksasa */}
              <div className="flex justify-center items-baseline gap-3 my-2">
                <span className="text-7xl font-extrabold text-orange-500">
                  {selectedLetter.letter}
                </span>
                <span className="text-5xl font-bold text-slate-400">
                  {selectedLetter.letter.toLowerCase()}
                </span>
              </div>

              {/* Tombol Dengar Bunyi Huruf */}
              <button
                onClick={() => handlePlayLetterSound(selectedLetter)}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-200 btn-kids-pop"
              >
                <Volume2 className="w-5 h-5" />
                Dengar Bunyi Huruf "{selectedLetter.letter}"
              </button>

              {/* Benda Contoh */}
              <div className="mt-6 bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col items-center">
                <span className="text-5xl mb-2">{selectedLetter.emoji}</span>
                <span className="text-2xl font-extrabold text-slate-800">
                  {selectedLetter.word}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Ejaan: {selectedLetter.syllables.join(' - ')}
                </p>

                <button
                  onClick={() => handlePlayWordSound(selectedLetter)}
                  className="mt-3 text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-orange-200 shadow-sm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Dengar Kata "{selectedLetter.word}"
                </button>
              </div>

              {/* Tombol Aku Sudah Hafal! */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    handleMarkLearned(selectedLetter);
                    setSelectedLetter(null);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 btn-kids-pop"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aku Sudah Hafal! (+1 ⭐)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
