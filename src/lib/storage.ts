export interface QuizRecord {
  id: string;
  date: string;
  gameType: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
}

export interface UserProgress {
  childName: string;
  avatar: string;
  stars: number;
  learnedLetters: string[];
  learnedSyllables: string[];
  learnedWords: string[];
  unlockedStickerIds: string[];
  quizHistory: QuizRecord[];
  speechRate: number; // 0.55 = sangat lambat, 0.65 = pelan & santai (rekomendasi), 0.8 = normal
  dailyPracticeMinutes: number;
  fontFamily: 'lexend' | 'jakarta' | 'inter';
}

const STORAGE_KEY = 'bintang_baca_progress_v1';

export const AVATAR_OPTIONS = [
  { id: 'cat', emoji: '🐱', label: 'Kucing Cerdik' },
  { id: 'rabbit', emoji: '🐰', label: 'Kelinci Lincah' },
  { id: 'bear', emoji: '🐻', label: 'Beruang Baik' },
  { id: 'lion', emoji: '🦁', label: 'Singa Berani' },
  { id: 'panda', emoji: '🐼', label: 'Panda Lucu' },
  { id: 'star', emoji: '⭐', label: 'Bintang Pintar' },
];

export const FONT_OPTIONS = [
  {
    id: 'lexend',
    name: 'Lexend (Sangat Jelas & Edukasi)',
    description: 'Didesain khusus peneliti membaca untuk mengurangi stres visual & mempercepat pemahaman huruf anak.',
    cssClass: "font-['Lexend',sans-serif]",
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans (Modern & Bersih)',
    description: 'Font sans-serif modern dengan bentuk kurva simetris, rapi, dan mudah dibedakan.',
    cssClass: "font-['Plus_Jakarta_Sans',sans-serif]",
  },
  {
    id: 'inter',
    name: 'Inter (Standar Jernih)',
    description: 'Bentuk huruf netral, tegas, dan kontras tinggi seperti di buku teks resmi.',
    cssClass: "font-['Inter',sans-serif]",
  },
];

export const INITIAL_PROGRESS: UserProgress = {
  childName: 'Adik Pintar',
  avatar: '⭐',
  stars: 3,
  learnedLetters: ['A', 'B', 'I'],
  learnedSyllables: ['ba', 'bi', 'bu'],
  learnedWords: ['baju', 'bola'],
  unlockedStickerIds: ['stk_1'],
  quizHistory: [
    {
      id: 'init-1',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      gameType: 'Tebak Gambar',
      score: 3,
      totalQuestions: 3,
      accuracy: 100,
    },
  ],
  speechRate: 0.65, // Tempo default santai & jelas untuk balita / TK
  dailyPracticeMinutes: 10,
  fontFamily: 'lexend',
};

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProgress(INITIAL_PROGRESS);
      return INITIAL_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.fontFamily) {
      parsed.fontFamily = 'lexend';
    }
    // Jika masih menggunakan rate lama 0.8 yang terlalu cepat, migrasikan ke 0.65
    if (!parsed.speechRate || parsed.speechRate >= 0.75) {
      parsed.speechRate = 0.65;
      saveProgress(parsed);
    }
    return parsed;
  } catch (e) {
    console.error('Gagal membaca progress:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Gagal menyimpan progress:', e);
  }
}

export function addStars(count: number): number {
  const current = getProgress();
  current.stars = Math.max(0, current.stars + count);

  // Periksa apakah ada stiker baru yang terbuka
  const { STICKER_COLLECTION } = require('@/data/curriculum');
  STICKER_COLLECTION.forEach((stk: { id: string; unlockedAtStars: number }) => {
    if (current.stars >= stk.unlockedAtStars && !current.unlockedStickerIds.includes(stk.id)) {
      current.unlockedStickerIds.push(stk.id);
    }
  });

  saveProgress(current);
  return current.stars;
}

export function markLetterLearned(letter: string) {
  const current = getProgress();
  if (!current.learnedLetters.includes(letter)) {
    current.learnedLetters.push(letter);
    current.stars += 1;
    saveProgress(current);
  }
}

export function markSyllableLearned(syllable: string) {
  const current = getProgress();
  if (!current.learnedSyllables.includes(syllable)) {
    current.learnedSyllables.push(syllable);
    current.stars += 1;
    saveProgress(current);
  }
}

export function markWordLearned(word: string) {
  const current = getProgress();
  if (!current.learnedWords.includes(word)) {
    current.learnedWords.push(word);
    current.stars += 2;
    saveProgress(current);
  }
}

export function recordQuiz(record: Omit<QuizRecord, 'id'>) {
  const current = getProgress();
  const newRecord: QuizRecord = {
    ...record,
    id: `quiz-${Date.now()}`,
  };
  current.quizHistory.unshift(newRecord);
  if (current.quizHistory.length > 20) {
    current.quizHistory = current.quizHistory.slice(0, 20);
  }
  current.dailyPracticeMinutes += 3;
  saveProgress(current);
}

export function resetProgress() {
  saveProgress(INITIAL_PROGRESS);
}
