'use client';

import React, { useState, useEffect } from 'react';
import { READING_WORDS, ReadingWord } from '@/data/curriculum';
import { speakWord, speakText, stopSpeech } from '@/lib/speech';
import {
  playClickSound,
  playCorrectSound,
  playTryAgainSound,
  playCelebrationSound,
} from '@/lib/soundEffects';
import { recordQuiz, addStars } from '@/lib/storage';
import { Volume2, Trophy, RotateCcw, Sparkles, Check, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizArenaProps {
  onProgressUpdate: () => void;
}

type GameMode = 'guess-word' | 'scramble' | 'listen-find';

export default function QuizArena({ onProgressUpdate }: QuizArenaProps) {
  const [activeMode, setActiveMode] = useState<GameMode>('guess-word');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Soal saat ini
  const [currentWord, setCurrentWord] = useState<ReadingWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // State untuk mode susun suku kata
  const [scrambledSyllables, setScrambledSyllables] = useState<string[]>([]);
  const [userArranged, setUserArranged] = useState<string[]>([]);

  const TOTAL_QUESTIONS = 5;

  // Inisialisasi putaran soal baru
  const setupQuestion = (mode: GameMode, qIdx: number) => {
    setSelectedOption(null);
    setIsCorrect(null);
    setUserArranged([]);

    // Pilih kata acak dari READING_WORDS
    const shuffledWords = [...READING_WORDS].sort(() => 0.5 - Math.random());
    const target = shuffledWords[0];
    setCurrentWord(target);

    if (mode === 'guess-word') {
      // 3 pilihan kata
      const distractors = shuffledWords.slice(1, 3).map((w) => w.word);
      const allOpts = [target.word, ...distractors].sort(() => 0.5 - Math.random());
      setOptions(allOpts);
    } else if (mode === 'scramble') {
      // Acak suku kata
      const syllables = [...target.syllables].sort(() => 0.5 - Math.random());
      setScrambledSyllables(syllables);
    } else if (mode === 'listen-find') {
      const distractors = shuffledWords.slice(1, 3).map((w) => w.word);
      const allOpts = [target.word, ...distractors].sort(() => 0.5 - Math.random());
      setOptions(allOpts);

      // Otomatis bunyikan instruksi audio
      setTimeout(() => {
        speakText(`Cari kata: ${target.word}`, { rate: 0.75 });
      }, 300);
    }
  };

  useEffect(() => {
    setupQuestion(activeMode, questionIndex);
  }, [activeMode, questionIndex]);

  const handleStartGame = (mode: GameMode) => {
    playClickSound();
    stopSpeech();
    setActiveMode(mode);
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
  };

  // Jawaban untuk mode Tebak Kata atau Dengar & Cari
  const handleSelectOption = (opt: string) => {
    if (selectedOption !== null || !currentWord) return;

    setSelectedOption(opt);
    const correct = opt.toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      speakWord(opt);
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    } else {
      playTryAgainSound();
    }

    setTimeout(() => {
      if (questionIndex + 1 < TOTAL_QUESTIONS) {
        setQuestionIndex((prev) => prev + 1);
      } else {
        finishGame(score + (correct ? 1 : 0));
      }
    }, 1500);
  };

  // Interaksi Susun Suku Kata
  const handlePickSyllable = (syl: string, idx: number) => {
    if (!currentWord || isCorrect !== null) return;
    playClickSound();
    speakWord(syl);

    const newArranged = [...userArranged, syl];
    setUserArranged(newArranged);

    // Hapus dari suku kata yang tersedia
    const remaining = [...scrambledSyllables];
    remaining.splice(idx, 1);
    setScrambledSyllables(remaining);

    // Jika sudah menyusun sejumlah suku kata yang dibutuhkan
    if (newArranged.length === currentWord.syllables.length) {
      const formedWord = newArranged.join('');
      const correct = formedWord.toLowerCase() === currentWord.word.toLowerCase();
      setIsCorrect(correct);

      if (correct) {
        playCorrectSound();
        speakWord(currentWord.word);
        setScore((prev) => prev + 1);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        playTryAgainSound();
      }

      setTimeout(() => {
        if (questionIndex + 1 < TOTAL_QUESTIONS) {
          setQuestionIndex((prev) => prev + 1);
        } else {
          finishGame(score + (correct ? 1 : 0));
        }
      }, 1500);
    }
  };

  // Reset susun kata jika anak ingin menata ulang
  const handleResetArrangement = () => {
    if (!currentWord || isCorrect !== null) return;
    playClickSound();
    setScrambledSyllables([...currentWord.syllables].sort(() => 0.5 - Math.random()));
    setUserArranged([]);
  };

  const finishGame = (finalScore: number) => {
    setIsGameOver(true);
    playCelebrationSound();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });

    const accuracy = Math.round((finalScore / TOTAL_QUESTIONS) * 100);
    const bonusStars = finalScore * 2;
    addStars(bonusStars);

    const gameNames: Record<GameMode, string> = {
      'guess-word': 'Tebak Gambar',
      scramble: 'Susun Suku Kata',
      'listen-find': 'Dengar & Pilih',
    };

    recordQuiz({
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      gameType: gameNames[activeMode],
      score: finalScore,
      totalQuestions: TOTAL_QUESTIONS,
      accuracy,
    });

    onProgressUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Header Arena */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            Arena Bermain & Kuis
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Tantangan Kuis Membaca Ceria 🎮
          </h2>
          <p className="text-amber-100 text-sm md:text-base mt-1">
            Mainkan mini-game seru, dengar petunjuk audio, kumpulkan bintang juara!
          </p>
        </div>

        {/* Tab Pilihan Game */}
        <div className="flex bg-black/20 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => handleStartGame('guess-word')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeMode === 'guess-word' ? 'bg-white text-rose-600 shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            🖼️ Tebak Gambar
          </button>
          <button
            onClick={() => handleStartGame('scramble')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeMode === 'scramble' ? 'bg-white text-rose-600 shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            🧩 Susun Suku Kata
          </button>
          <button
            onClick={() => handleStartGame('listen-find')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeMode === 'listen-find' ? 'bg-white text-rose-600 shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            🎧 Dengar & Cari
          </button>
        </div>
      </div>

      {/* Konten Kuis */}
      {!isGameOver ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm max-w-2xl mx-auto">
          {/* Progress Bar Soal */}
          <div className="flex items-center justify-between text-sm font-extrabold text-slate-500 mb-6">
            <span>Soal {questionIndex + 1} dari {TOTAL_QUESTIONS}</span>
            <span className="flex items-center gap-1 text-amber-500">
              <Trophy className="w-4 h-4" /> Skor: {score}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-8">
            <div
              className="bg-rose-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((questionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>

          {currentWord && (
            <div className="text-center">
              {/* MODE 1: TEBAK GAMBAR */}
              {activeMode === 'guess-word' && (
                <div>
                  <div className="text-7xl mb-4 animate-bounce-slow select-none">
                    {currentWord.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-6">
                    Benda apakah ini? Pilih tulisan yang benar:
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {options.map((opt) => {
                      const isSelected = selectedOption === opt;
                      const isTarget = opt.toLowerCase() === currentWord.word.toLowerCase();

                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-300';
                      if (selectedOption !== null) {
                        if (isSelected && isCorrect) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200';
                        } else if (isTarget) {
                          btnStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={selectedOption !== null}
                          onClick={() => handleSelectOption(opt)}
                          className={`py-4 px-3 rounded-2xl border-2 font-black text-2xl capitalize transition btn-kids-pop ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODE 2: SUSUN SUKU KATA */}
              {activeMode === 'scramble' && (
                <div>
                  <div className="text-7xl mb-2 select-none">{currentWord.emoji}</div>

                  {/* Tombol Audio Bantuan */}
                  <button
                    onClick={() => {
                      playClickSound();
                      speakWord(currentWord.word);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-4 hover:bg-rose-100 transition"
                  >
                    <Volume2 className="w-4 h-4" /> Dengar Petunjuk Suara
                  </button>

                  <h3 className="text-lg font-bold text-slate-700 mb-4">
                    Susun suku kata di bawah menjadi kata yang tepat:
                  </h3>

                  {/* Tempat Balok Tersusun */}
                  <div className="flex justify-center items-center gap-2 min-h-[68px] p-3 bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl mb-6">
                    {userArranged.length === 0 ? (
                      <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                        <HelpCircle className="w-4 h-4" /> Sentuh balok suku kata di bawah secara berurutan
                      </span>
                    ) : (
                      userArranged.map((syl, i) => (
                        <span
                          key={i}
                          className="px-5 py-2.5 rounded-2xl bg-amber-400 text-slate-900 font-black text-2xl shadow-sm animate-in zoom-in-50"
                        >
                          {syl}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Pilihan Suku Kata yang Tersedia */}
                  <div className="flex justify-center items-center gap-3">
                    {scrambledSyllables.map((syl, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePickSyllable(syl, idx)}
                        className="px-6 py-3 rounded-2xl bg-white border-2 border-rose-300 text-rose-600 font-black text-2xl shadow-sm hover:bg-rose-50 transition btn-kids-pop"
                      >
                        {syl}
                      </button>
                    ))}
                  </div>

                  {userArranged.length > 0 && isCorrect === null && (
                    <button
                      onClick={handleResetArrangement}
                      className="mt-6 text-xs text-slate-400 hover:text-slate-600 font-bold inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Ulangi susunan
                    </button>
                  )}
                </div>
              )}

              {/* MODE 3: DENGAR & CARI KARTU */}
              {activeMode === 'listen-find' && (
                <div>
                  {/* Tombol Speaker Besar untuk Dengar Ulang */}
                  <div className="my-4">
                    <button
                      onClick={() => {
                        playClickSound();
                        speakText(`Cari kata: ${currentWord.word}`, { rate: 0.75 });
                      }}
                      className="p-6 rounded-full bg-rose-500 text-white shadow-xl shadow-rose-200 hover:bg-rose-600 transition btn-kids-pop speaking-pulse"
                      title="Klik untuk mendengarkan suara lagi"
                    >
                      <Volume2 className="w-12 h-12" />
                    </button>
                    <p className="text-xs text-rose-500 font-extrabold mt-3">
                      Sentuh speaker untuk mendengar ulang kata! 🔊
                    </p>
                  </div>

                  <h3 className="text-lg font-bold text-slate-700 my-4">
                    Kartu manakah yang tadi disebutkan?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {options.map((opt) => {
                      const isSelected = selectedOption === opt;
                      const isTarget = opt.toLowerCase() === currentWord.word.toLowerCase();
                      const wordObj = READING_WORDS.find((w) => w.word.toLowerCase() === opt.toLowerCase());

                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-300';
                      if (selectedOption !== null) {
                        if (isSelected && isCorrect) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200';
                        } else if (isTarget) {
                          btnStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={selectedOption !== null}
                          onClick={() => handleSelectOption(opt)}
                          className={`py-4 px-3 rounded-2xl border-2 font-black text-xl capitalize transition flex flex-col items-center gap-1 btn-kids-pop ${btnStyle}`}
                        >
                          <span className="text-3xl">{wordObj?.emoji || '⭐'}</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Halaman Selesai / Skor */
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-xl max-w-md mx-auto text-center animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto text-4xl mb-4">
            🏆
          </div>

          <h3 className="text-2xl font-black text-slate-800 mb-1">
            Luar Biasa, Hebat Sekali! 🎉
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            Kamu telah menyelesaikan latihan kuis ini dengan baik!
          </p>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6">
            <div className="text-4xl font-black text-amber-600 mb-1">
              {score} / {TOTAL_QUESTIONS}
            </div>
            <p className="text-xs font-bold text-amber-700">
              Bonus Bintang Didapatkan: +{score * 2} ⭐
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleStartGame(activeMode)}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold shadow-lg shadow-rose-200 flex items-center justify-center gap-2 btn-kids-pop"
            >
              <RotateCcw className="w-5 h-5" />
              Main Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
