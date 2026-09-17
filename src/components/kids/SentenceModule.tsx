'use client';

import React, { useState } from 'react';
import { SIMPLE_SENTENCES, SimpleSentence } from '@/data/curriculum';
import { speakWord, speakText, stopSpeech } from '@/lib/speech';
import { playClickSound, playCorrectSound } from '@/lib/soundEffects';
import { addStars } from '@/lib/storage';
import { Volume2, Sparkles, CheckCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SentenceModuleProps {
  onProgressUpdate: () => void;
}

export default function SentenceModule({ onProgressUpdate }: SentenceModuleProps) {
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [highlightedWordIdx, setHighlightedWordIdx] = useState<{ sentenceId: string; idx: number | null } | null>(null);
  const [completedSentences, setCompletedSentences] = useState<string[]>([]);

  // Klik kata individual
  const handleWordClick = (sentenceId: string, word: string, idx: number) => {
    playClickSound();
    setHighlightedWordIdx({ sentenceId, idx });
    speakWord(word, () => {
      setHighlightedWordIdx(null);
    });
  };

  // Baca seluruh kalimat dengan kata per kata highlight
  const handlePlaySentence = (item: SimpleSentence) => {
    stopSpeech();
    playClickSound();
    setActiveSpeakingId(item.id);

    speakText(item.sentence, { rate: 0.75 }, () => {
      setActiveSpeakingId(null);
      setHighlightedWordIdx(null);
    });
  };

  const handleCompleteSentence = (sentenceId: string) => {
    if (completedSentences.includes(sentenceId)) return;
    playCorrectSound();
    setCompletedSentences((prev) => [...prev, sentenceId]);
    addStars(3);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 },
    });
    onProgressUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Header Modul */}
      <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            Modul 4: Membaca Kalimat Sederhana
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Latihan Membaca Kalimat Pendek 🌟
          </h2>
          <p className="text-purple-100 text-sm md:text-base mt-1">
            Sentuh tiap kata untuk membacanya, lalu dengarkan pengucapan kalimat secara utuh!
          </p>
        </div>
      </div>

      {/* Daftar Kalimat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SIMPLE_SENTENCES.map((item, index) => {
          const isCompleted = completedSentences.includes(item.id);
          const isSpeakingThis = activeSpeakingId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 border-2 transition shadow-sm hover:shadow-md flex flex-col justify-between ${
                isSpeakingThis
                  ? 'border-purple-500 ring-4 ring-purple-100'
                  : 'border-slate-100 hover:border-purple-200'
              }`}
            >
              <div>
                {/* Baris Atas */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                    Kalimat #{index + 1}
                  </span>
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
                      ? 'bg-emerald-100 text-emerald-700 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-600 text-white btn-kids-pop shadow-sm'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Lancar!
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
