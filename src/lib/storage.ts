import { STICKER_COLLECTION } from '@/data/curriculum';

export interface QuizRecord {
  id: string;
  date: string;
  gameType: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
}

export interface AnimalCharacter {
  id: string;
  emoji: string;
  name: string;
  trait: string;
  color: string;
  bgGrad: string;
}

export const ANIMAL_CHARACTERS: AnimalCharacter[] = [
  { id: 'lion', emoji: '🦁', name: 'Singa Berani', trait: 'Penuh Semangat & Berani', color: 'text-amber-600', bgGrad: 'from-amber-400 to-orange-500' },
  { id: 'rabbit', emoji: '🐰', name: 'Kelinci Ceria', trait: 'Lincah & Cepat Belajar', color: 'text-pink-600', bgGrad: 'from-pink-400 to-rose-500' },
  { id: 'cat', emoji: '🐱', name: 'Kucing Pintar', trait: 'Cerdik & Rajin Membaca', color: 'text-indigo-600', bgGrad: 'from-indigo-400 to-blue-500' },
  { id: 'panda', emoji: '🐼', name: 'Panda Lucu', trait: 'Penyabar & Suka Belajar', color: 'text-emerald-600', bgGrad: 'from-emerald-400 to-teal-500' },
  { id: 'bear', emoji: '🐻', name: 'Beruang Baik', trait: 'Ramah & Suka Membantu', color: 'text-amber-800', bgGrad: 'from-amber-500 to-yellow-600' },
  { id: 'fox', emoji: '🦊', name: 'Rubah Cerdik', trait: 'Kreatif & Selalu Ingin Tahu', color: 'text-orange-600', bgGrad: 'from-orange-400 to-red-500' },
  { id: 'dolphin', emoji: '🐬', name: 'Lumba-Lumba Ramah', trait: 'Ceria & Suka Bercerita', color: 'text-cyan-600', bgGrad: 'from-sky-400 to-blue-600' },
  { id: 'chick', emoji: '🐥', name: 'Anak Ayam Lincah', trait: 'Semangat & Penuh Tawa', color: 'text-yellow-600', bgGrad: 'from-yellow-300 to-amber-500' },
  { id: 'elephant', emoji: '🐘', name: 'Gajah Sahabat', trait: 'Setia & Ingatan Kuat', color: 'text-slate-600', bgGrad: 'from-slate-400 to-gray-600' },
];

export const AVATAR_OPTIONS = ANIMAL_CHARACTERS.map((a) => ({
  id: a.id,
  emoji: a.emoji,
  label: a.name,
}));

export interface UserProgress {
  id: string;
  childName: string;
  avatar: string;
  animalLabel: string;
  stars: number;
  learnedLetters: string[];
  learnedSyllables: string[];
  learnedWords: string[];
  unlockedStickerIds: string[];
  quizHistory: QuizRecord[];
  speechRate: number;
  dailyPracticeMinutes: number;
  fontFamily: 'lexend' | 'jakarta' | 'inter';
  createdAt: string;
}

const PROFILES_KEY = 'rafa_bintang_baca_profiles_v2';
const ACTIVE_PROFILE_KEY = 'rafa_bintang_baca_active_id_v2';
const LEGACY_STORAGE_KEY = 'bintang_baca_progress_v1';

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

export const INITIAL_DEFAULT_PROFILE: UserProgress = {
  id: 'profile_rafa_default',
  childName: 'Rafa',
  avatar: '🦁',
  animalLabel: 'Singa Berani',
  stars: 10,
  learnedLetters: ['A', 'B', 'C', 'D', 'E', 'I', 'U', 'O'],
  learnedSyllables: ['ba', 'bi', 'bu', 'be', 'bo', 'ca', 'ci'],
  learnedWords: ['baju', 'bola', 'kuda', 'meja'],
  unlockedStickerIds: ['stk_1', 'stk_2', 'stk_3'],
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
  speechRate: 0.65,
  dailyPracticeMinutes: 10,
  fontFamily: 'lexend',
  createdAt: new Date().toISOString(),
};

/**
 * Sinkronkan stiker otomatis berdasarkan total perolehan bintang
 */
export function syncUnlockedStickers(current: UserProgress): UserProgress {
  if (!current.unlockedStickerIds) {
    current.unlockedStickerIds = [];
  }
  STICKER_COLLECTION.forEach((stk) => {
    if (current.stars >= stk.unlockedAtStars && !current.unlockedStickerIds.includes(stk.id)) {
      current.unlockedStickerIds.push(stk.id);
    }
  });
  return current;
}

/**
 * Mengambil semua profil anak yang tersimpan
 */
export function getAllProfiles(): UserProgress[] {
  if (typeof window === 'undefined') return [INITIAL_DEFAULT_PROFILE];

  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed: UserProgress[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => syncUnlockedStickers(p));
      }
    }

    // Migrasi otomatis dari data single-profile lama jika ada
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    let initialProfiles: UserProgress[] = [];

    if (legacyRaw) {
      try {
        const legacy = JSON.parse(legacyRaw);
        const migrated: UserProgress = {
          ...INITIAL_DEFAULT_PROFILE,
          id: 'profile_migrated',
          childName: legacy.childName || 'Rafa',
          avatar: legacy.avatar || '🦁',
          animalLabel: 'Singa Berani',
          stars: typeof legacy.stars === 'number' ? legacy.stars : 10,
          learnedLetters: legacy.learnedLetters || INITIAL_DEFAULT_PROFILE.learnedLetters,
          learnedSyllables: legacy.learnedSyllables || INITIAL_DEFAULT_PROFILE.learnedSyllables,
          learnedWords: legacy.learnedWords || INITIAL_DEFAULT_PROFILE.learnedWords,
          unlockedStickerIds: legacy.unlockedStickerIds || ['stk_1', 'stk_2', 'stk_3'],
          quizHistory: legacy.quizHistory || INITIAL_DEFAULT_PROFILE.quizHistory,
          speechRate: legacy.speechRate || 0.65,
          fontFamily: legacy.fontFamily || 'lexend',
          dailyPracticeMinutes: legacy.dailyPracticeMinutes || 10,
        };
        initialProfiles = [syncUnlockedStickers(migrated)];
      } catch {
        initialProfiles = [syncUnlockedStickers(INITIAL_DEFAULT_PROFILE)];
      }
    } else {
      initialProfiles = [syncUnlockedStickers(INITIAL_DEFAULT_PROFILE)];
    }

    localStorage.setItem(PROFILES_KEY, JSON.stringify(initialProfiles));
    return initialProfiles;
  } catch (e) {
    console.error('Gagal membaca profil:', e);
    return [INITIAL_DEFAULT_PROFILE];
  }
}

/**
 * Mengambil ID profil aktif saat ini
 */
export function getActiveProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

/**
 * Menetapkan ID profil aktif (atau null untuk keluar/ke halaman pilih akun)
 */
export function setActiveProfileId(id: string | null) {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
}

/**
 * Mengambil data profil yang sedang aktif
 */
export function getActiveProfile(): UserProgress | null {
  if (typeof window === 'undefined') return null;
  const activeId = getActiveProfileId();
  if (!activeId) return null;

  const profiles = getAllProfiles();
  const found = profiles.find((p) => p.id === activeId);
  return found ? syncUnlockedStickers(found) : null;
}

/**
 * Membuat profil anak baru dengan karakter hewan
 */
export function createProfile(name: string, animalId: string): UserProgress {
  const profiles = getAllProfiles();
  const selectedAnimal =
    ANIMAL_CHARACTERS.find((a) => a.id === animalId) || ANIMAL_CHARACTERS[0];

  const newProfile: UserProgress = {
    id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    childName: name.trim() || 'Adik Ceria',
    avatar: selectedAnimal.emoji,
    animalLabel: selectedAnimal.name,
    stars: 3, // Bintang sambutan awal
    learnedLetters: ['A', 'I', 'U'],
    learnedSyllables: ['ba', 'bi', 'bu'],
    learnedWords: ['baju', 'bola'],
    unlockedStickerIds: ['stk_1'],
    quizHistory: [],
    speechRate: 0.65,
    dailyPracticeMinutes: 5,
    fontFamily: 'lexend',
    createdAt: new Date().toISOString(),
  };

  const updatedProfiles = [...profiles, syncUnlockedStickers(newProfile)];
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
    setActiveProfileId(newProfile.id);
  }

  return newProfile;
}

/**
 * Menghapus profil
 */
export function deleteProfile(id: string) {
  if (typeof window === 'undefined') return;
  const profiles = getAllProfiles().filter((p) => p.id !== id);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  if (getActiveProfileId() === id) {
    setActiveProfileId(null);
  }
}

// -------------------------------------------------------------
// FUNGSI KOMPATIBILITAS PROGRESS (Untuk semua modul yang ada)
// -------------------------------------------------------------

export function getProgress(): UserProgress {
  const active = getActiveProfile();
  if (active) return active;

  const profiles = getAllProfiles();
  if (profiles.length > 0) return profiles[0];

  return INITIAL_DEFAULT_PROFILE;
}

export function saveProgress(updated: UserProgress) {
  if (typeof window === 'undefined') return;
  const profiles = getAllProfiles();
  const idx = profiles.findIndex((p) => p.id === updated.id);

  const synced = syncUnlockedStickers(updated);

  let newProfiles: UserProgress[];
  if (idx !== -1) {
    newProfiles = [...profiles];
    newProfiles[idx] = synced;
  } else {
    newProfiles = [...profiles, synced];
  }

  localStorage.setItem(PROFILES_KEY, JSON.stringify(newProfiles));
}

export function addStars(count: number): number {
  const current = getProgress();
  current.stars = Math.max(0, current.stars + count);
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
  const active = getActiveProfile();
  if (active) {
    active.stars = 3;
    active.learnedLetters = ['A', 'I', 'U'];
    active.learnedSyllables = ['ba', 'bi', 'bu'];
    active.learnedWords = ['baju'];
    active.unlockedStickerIds = ['stk_1'];
    active.quizHistory = [];
    saveProgress(active);
  }
}

export const INITIAL_PROGRESS = INITIAL_DEFAULT_PROFILE;
