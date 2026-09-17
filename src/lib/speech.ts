// Web Speech API Engine untuk Bahasa Indonesia (Tempo Ramah Anak TK)
import { getProgress } from './storage';

export interface SpeechSettings {
  rate: number; // Kecepatan bicara (0.55 - 0.85, default 0.65 ramah balita/TK)
  pitch: number; // Nada suara (0.9 - 1.2, default 1.1 nada ramah)
  volume: number; // Volume suara (0 - 1)
}

const DEFAULT_SETTINGS: SpeechSettings = {
  rate: 0.65, // Tempo diperlambat agar artikulasi jelas
  pitch: 1.1,
  volume: 1.0,
};

let activeUtterance: SpeechSynthesisUtterance | null = null;

// Mengambil kecepatan yang tersimpan di pengaturan atau fallback ke 0.65
export function getSavedSpeechRate(): number {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS.rate;
  try {
    const p = getProgress();
    if (p && typeof p.speechRate === 'number') {
      return p.speechRate;
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_SETTINGS.rate;
}

// Mengambil voice terbaik bahasa Indonesia
function getIndonesianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  // Cari voice id-ID
  const idVoice = voices.find(
    (v) => v.lang.toLowerCase() === 'id-id' || v.lang.toLowerCase() === 'id' || v.lang.toLowerCase().startsWith('id')
  );

  return idVoice || null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

/**
 * Membunyikan teks apapun dengan suara bahasa Indonesia bertempo santai
 */
export function speakText(
  text: string,
  customSettings?: Partial<SpeechSettings>,
  onEnd?: () => void
): boolean {
  if (!isSpeechSupported()) {
    console.warn('Web Speech API tidak didukung di browser ini.');
    return false;
  }

  stopSpeech();

  const currentSavedRate = getSavedSpeechRate();
  const effectiveRate = customSettings?.rate ?? currentSavedRate;

  const settings: SpeechSettings = {
    ...DEFAULT_SETTINGS,
    rate: effectiveRate,
    ...customSettings,
  };

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  utterance.volume = settings.volume;

  const idVoice = getIndonesianVoice();
  if (idVoice) {
    utterance.voice = idVoice;
  }

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('Kesalahan pelafalan suara:', e);
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Melafalkan Huruf Alfabet (A, B, C...) dengan artikulasi lambat & tegas
 */
export function speakLetter(letter: string, soundCue?: string, onEnd?: () => void) {
  const cleanLetter = letter.trim().toUpperCase();

  // Pengucapan fonik huruf Indonesia agar terdengar jelas oleh anak TK
  const phoneticMap: Record<string, string> = {
    A: 'A',
    B: 'Bé',
    C: 'Cé',
    D: 'Dé',
    E: 'É',
    F: 'Ef',
    G: 'Gé',
    H: 'Ha',
    I: 'I',
    J: 'Jé',
    K: 'Ka',
    L: 'El',
    M: 'Em',
    N: 'En',
    O: 'O',
    P: 'Pé',
    Q: 'Kiu',
    R: 'Er',
    S: 'Es',
    T: 'Té',
    U: 'U',
    V: 'Vé',
    W: 'Wé',
    X: 'Eks',
    Y: 'Yé',
    Z: 'Zet',
  };

  const textToSpeak = phoneticMap[cleanLetter] || cleanLetter;
  const rate = Math.min(getSavedSpeechRate(), 0.62); // Pelan agar terdengar jelas
  return speakText(textToSpeak, { rate, pitch: 1.15 }, onEnd);
}

/**
 * Melafalkan Suku Kata (ba, bi, bu, ca, ci, dll) dengan tempo pelan
 */
export function speakSyllable(syllable: string, onEnd?: () => void) {
  const rate = Math.min(getSavedSpeechRate(), 0.65);
  return speakText(syllable.toLowerCase(), { rate, pitch: 1.1 }, onEnd);
}

/**
 * Melafalkan Kata Utuh (Baju, Bola, Sepatu) secara jernih
 */
export function speakWord(word: string, onEnd?: () => void) {
  const rate = Math.min(getSavedSpeechRate(), 0.68);
  return speakText(word.toLowerCase(), { rate, pitch: 1.1 }, onEnd);
}

/**
 * Mode Eja Bertahap & Karaoke Highlight (Sangat Ramah Anak):
 * Memberikan jeda yang cukup antar suku kata agar anak dapat menirukan bunyi:
 * "ba" ... (jeda 600ms) ... "ju" ... (jeda 500ms) ... "baju!"
 */
export function spellAndSpeakWord(
  syllables: string[],
  fullWord: string,
  onHighlightSyllable?: (index: number | null) => void,
  onComplete?: () => void
) {
  stopSpeech();

  let step = 0;

  function runStep() {
    if (step < syllables.length) {
      const currentIdx = step;
      if (onHighlightSyllable) onHighlightSyllable(currentIdx);

      speakSyllable(syllables[currentIdx], () => {
        step++;
        // Jeda 600ms antar suku kata agar tidak terburu-buru
        setTimeout(runStep, 600);
      });
    } else if (step === syllables.length) {
      if (onHighlightSyllable) onHighlightSyllable(null); // highlight kata utuh

      // Jeda 500ms sebelum membaca kata utuh
      setTimeout(() => {
        speakWord(fullWord, () => {
          if (onComplete) onComplete();
        });
      }, 500);
    }
  }

  runStep();
}
