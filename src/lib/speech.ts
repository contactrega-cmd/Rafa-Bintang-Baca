// Engine Suara Pelafalan Bahasa Indonesia (Ramah Balita & Anak TK)
// Menggabungkan Audio TTS Alami Berkualitas Tinggi + Fallback Web Speech API
import { getProgress } from './storage';

export interface SpeechSettings {
  rate: number; // Kecepatan bicara (0.55 - 0.85, default 0.65 ramah balita/TK)
  pitch: number; // Nada suara (0.9 - 1.2, default 1.1)
  volume: number; // Volume suara (0 - 1)
}

const DEFAULT_SETTINGS: SpeechSettings = {
  rate: 0.55, // Default tempo 0.55x (Sangat Pelan & Jelas untuk anak TK)
  pitch: 1.1,
  volume: 1.0,
};

// Pemetaan fonik huruf Indonesia agar terdengar tepat, tegas, dan langsung (tanpa 'huruf besar')
export const PHONETIC_MAP: Record<string, string> = {
  A: 'a',
  B: 'bé',
  C: 'cé',
  D: 'dé',
  E: 'e',
  F: 'ef',
  G: 'gé',
  H: 'ha',
  I: 'i',
  J: 'je',
  K: 'ka',
  L: 'el',
  M: 'em',
  N: 'en',
  O: 'o',
  P: 'pé',
  Q: 'ki',
  R: 'er',
  S: 'es',
  T: 'té',
  U: 'u',
  V: 've',
  W: 'we',
  X: 'eks',
  Y: 'ye',
  Z: 'zet',
};

// Global active audio & sequence controller
let currentAudio: HTMLAudioElement | null = null;
let currentSequenceId = 0;
let currentSpeechId = 0;
let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Mendapatkan pelafalan fonik bersih untuk huruf alfabet (selalu lowercase agar TTS tidak mengeja 'huruf besar')
 */
export function getLetterPhonetic(letter: string): string {
  const clean = letter.trim().toUpperCase();
  return PHONETIC_MAP[clean] || clean.toLowerCase();
}

/**
 * Normalisasi teks untuk memastikan TTS tidak mengucapkan "huruf besar"
 * serta membersihkan format ejaan huruf tunggal atau prefix huruf
 */
export function normalizeTextForSpeech(text: string): string {
  const cleaned = text.trim();
  if (!cleaned) return '';

  // Jika berupa satu huruf tunggal (misal 'A', 'B', 'c')
  if (cleaned.length === 1) {
    return getLetterPhonetic(cleaned);
  }

  // Jika format seperti "A... Apel" atau "B - Bola" atau "A: Apel"
  const prefixMatch = cleaned.match(/^([a-zA-Z])(\s*(?:\.{2,}|-|:)\s*)(.*)$/);
  if (prefixMatch) {
    const [, letter, separator, rest] = prefixMatch;
    return `${getLetterPhonetic(letter)}${separator}${rest.toLowerCase()}`;
  }

  return cleaned.toLowerCase();
}

/**
 * Mengambil kecepatan bicara yang tersimpan di profil aktif
 */
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

/**
 * Cek apakah browser mendukung audio / speech
 */
export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof Audio !== 'undefined' || 'speechSynthesis' in window;
}

/**
 * Menghentikan semua audio dan ucapan yang sedang berjalan
 */
export function stopSpeech() {
  currentSequenceId++; // Batalkan sekuens yang sedang menunggu jeda
  currentSpeechId++;   // Batalkan eksekusi suara aktif sebelumnya

  // Hentikan HTML5 Audio
  if (currentAudio) {
    try {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch (e) {
      // ignore
    }
    currentAudio = null;
  }

  // Hentikan Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    activeUtterance = null;
  }
}

/**
 * Fallback jika audio online gagal/offline menggunakan Web Speech API internal browser
 */
function speakWithWebSpeech(
  text: string,
  settings: SpeechSettings,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    // Unpause jika sempat macet dan bersihkan antrean sebelumnya agar tidak dobel
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    const voices = window.speechSynthesis.getVoices();
    // Cari suara Indonesia (id-ID) atau Melayu (ms-MY)
    const idVoice = voices.find(
      (v) =>
        v.lang.toLowerCase() === 'id-id' ||
        v.lang.toLowerCase() === 'id' ||
        v.lang.toLowerCase().startsWith('id_') ||
        v.lang.toLowerCase().startsWith('id-') ||
        v.name.toLowerCase().includes('indonesia')
    );
    const msVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ms'));

    if (idVoice) {
      utterance.voice = idVoice;
      utterance.lang = idVoice.lang;
    } else if (msVoice) {
      utterance.voice = msVoice;
      utterance.lang = msVoice.lang;
    } else {
      utterance.lang = 'id-ID';
    }

    let finished = false;
    const handleFinish = () => {
      if (!finished) {
        finished = true;
        activeUtterance = null;
        if (onEnd) onEnd();
      }
    };

    utterance.onend = handleFinish;
    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      handleFinish();
    };

    // Safety timeout untuk mencegah macet di Chrome
    const estimatedDuration = Math.max(1200, (text.length / 4) * 1000 * (1 / settings.rate) + 800);
    setTimeout(() => {
      if (!finished) handleFinish();
    }, estimatedDuration);

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Gagal memutar Web Speech fallback:', err);
    if (onEnd) onEnd();
  }
}

/**
 * Membunyikan teks apapun dengan suara bahasa Indonesia bertempo ramah anak
 * Menjamin suara hanya diputar TEPAT 1 KALI (tanpa pengulangan / double trigger)
 */
export function speakText(
  text: string,
  customSettings?: Partial<SpeechSettings>,
  onEnd?: () => void
): boolean {
  if (!isSpeechSupported()) {
    console.warn('Audio tidak didukung di browser ini.');
    return false;
  }

  // Hentikan suara yang sedang aktif dan tandai ID invocation baru
  stopSpeech();
  const speechId = currentSpeechId;

  const currentSavedRate = getSavedSpeechRate();
  const effectiveRate = customSettings?.rate ?? currentSavedRate;
  const settings: SpeechSettings = {
    ...DEFAULT_SETTINGS,
    rate: effectiveRate,
    ...customSettings,
  };

  const cleanText = normalizeTextForSpeech(text);
  if (!cleanText) {
    if (onEnd) onEnd();
    return true;
  }

  // Penjaga ketat: Cegah eksekusi audio dan fallback berjalan bersamaan atau dobel
  let isExecuted = false;

  const handleComplete = () => {
    if (speechId !== currentSpeechId) return;
    if (isExecuted) return;
    isExecuted = true;
    currentAudio = null;
    if (onEnd) onEnd();
  };

  const handleFallback = () => {
    if (speechId !== currentSpeechId) return;
    if (isExecuted) return;
    isExecuted = true;

    // Bersihkan Audio Element sebelum beralih ke Web Speech API
    if (currentAudio) {
      try {
        currentAudio.onended = null;
        currentAudio.onerror = null;
        currentAudio.pause();
        currentAudio.src = '';
      } catch (e) {
        // ignore
      }
      currentAudio = null;
    }

    speakWithWebSpeech(cleanText, settings, onEnd);
  };

  try {
    const encodedText = encodeURIComponent(cleanText);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=id&client=tw-ob`;

    const audio = new Audio(ttsUrl);
    currentAudio = audio;

    // Sesuaikan kecepatan putar
    audio.playbackRate = Math.max(0.65, Math.min(1.2, settings.rate * 1.15));

    audio.onended = () => {
      handleComplete();
    };

    audio.onerror = () => {
      // Jika Google TTS gagal/offline/dibatasi browser, gunakan Web Speech API tepat satu kali
      handleFallback();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Autoplay dibatasi atau request diblokir, gunakan Web Speech API tepat satu kali
        handleFallback();
      });
    }

    return true;
  } catch (e) {
    console.warn('HTML5 Audio gagal, beralih ke Web Speech API:', e);
    handleFallback();
    return true;
  }
}

/**
 * Melafalkan Huruf Alfabet (A, B, C...) dengan artikulasi lambat & tegas (0.55x)
 * Langsung menyebutkan nama huruf tanpa awalan "huruf besar"
 */
export function speakLetter(letter: string, soundCue?: string, onEnd?: () => void) {
  const textToSpeak = getLetterPhonetic(letter);
  const rate = 0.55;
  return speakText(textToSpeak, { rate, pitch: 1.15 }, onEnd);
}

/**
 * Melafalkan Suku Kata (ba, bi, bu, ca, ci, dll) dengan tempo pelan (0.55x)
 */
export function speakSyllable(syllable: string, onEnd?: () => void) {
  const rate = 0.55;
  return speakText(syllable.toLowerCase(), { rate, pitch: 1.1 }, onEnd);
}

/**
 * Melafalkan Kata Utuh (Baju, Bola, Sepatu) secara jernih (0.55x)
 */
export function speakWord(word: string, onEnd?: () => void) {
  const rate = 0.55;
  return speakText(word.toLowerCase(), { rate, pitch: 1.1 }, onEnd);
}

/**
 * Mode Eja Bertahap & Karaoke Highlight (Sangat Ramah Anak):
 * Memberikan jeda yang cukup antar suku kata agar anak dapat menirukan bunyi:
 * "ba" ... (jeda 550ms) ... "ju" ... (jeda 500ms) ... "baju!"
 */
export function spellAndSpeakWord(
  syllables: string[],
  fullWord: string,
  onHighlightSyllable?: (index: number | null) => void,
  onComplete?: () => void
) {
  stopSpeech();

  const seqId = ++currentSequenceId;
  let step = 0;

  function runStep() {
    if (seqId !== currentSequenceId) return; // Batalkan jika ada aksi baru

    if (step < syllables.length) {
      const currentIdx = step;
      if (onHighlightSyllable) onHighlightSyllable(currentIdx);

      speakSyllable(syllables[currentIdx], () => {
        if (seqId !== currentSequenceId) return;
        step++;
        // Jeda 550ms antar suku kata agar anak sempat menirukan
        setTimeout(runStep, 550);
      });
    } else if (step === syllables.length) {
      if (onHighlightSyllable) onHighlightSyllable(null); // highlight kata utuh

      // Jeda 450ms sebelum membaca kata utuh
      setTimeout(() => {
        if (seqId !== currentSequenceId) return;
        speakWord(fullWord, () => {
          if (seqId !== currentSequenceId) return;
          if (onComplete) onComplete();
        });
      }, 450);
    }
  }

  runStep();
}
