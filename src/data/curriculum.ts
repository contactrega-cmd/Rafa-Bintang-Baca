export interface LetterItem {
  letter: string;
  isVowel: boolean;
  word: string;
  syllables: string[];
  emoji: string;
  soundCue: string;
  color: string;
}

export interface SyllableGroup {
  consonant: string;
  color: string;
  syllables: {
    syllable: string;
    vowel: string;
    sampleWord: string;
    sampleEmoji: string;
  }[];
}

export interface ReadingWord {
  id: string;
  word: string;
  syllables: string[];
  emoji: string;
  category: 'benda' | 'hewan' | 'makanan' | 'tubuh';
  level: 1 | 2; // 1 = 2 suku kata, 2 = 3 suku kata
  phoneticHint: string;
}

export interface SimpleSentence {
  id: string;
  sentence: string;
  words: {
    word: string;
    syllables: string[];
  }[];
  meaningEmoji: string;
  category?: 'keluarga' | 'hewan' | 'makanan' | 'aktivitas' | 'lingkungan';
}

export interface Sticker {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAtStars: number;
}

// 1. DATA HURUF A - Z
export const ALPHABET_DATA: LetterItem[] = [
  { letter: 'A', isVowel: true, word: 'Apel', syllables: ['A', 'pel'], emoji: '🍎', soundCue: 'A seperti Apel', color: 'from-red-400 to-rose-500' },
  { letter: 'B', isVowel: false, word: 'Bola', syllables: ['Bo', 'la'], emoji: '⚽', soundCue: 'B seperti Bola', color: 'from-blue-400 to-indigo-500' },
  { letter: 'C', isVowel: false, word: 'Ceri', syllables: ['Ce', 'ri'], emoji: '🍒', soundCue: 'C seperti Ceri', color: 'from-pink-400 to-rose-500' },
  { letter: 'D', isVowel: false, word: 'Dadu', syllables: ['Da', 'du'], emoji: '🎲', soundCue: 'D seperti Dadu', color: 'from-amber-400 to-orange-500' },
  { letter: 'E', isVowel: true, word: 'Elang', syllables: ['E', 'lang'], emoji: '🦅', soundCue: 'E seperti Elang', color: 'from-emerald-400 to-teal-500' },
  { letter: 'F', isVowel: false, word: 'Foto', syllables: ['Fo', 'to'], emoji: '📷', soundCue: 'F seperti Foto', color: 'from-cyan-400 to-blue-500' },
  { letter: 'G', isVowel: false, word: 'Gajah', syllables: ['Ga', 'jah'], emoji: '🐘', soundCue: 'G seperti Gajah', color: 'from-slate-400 to-gray-500' },
  { letter: 'H', isVowel: false, word: 'Hati', syllables: ['Ha', 'ti'], emoji: '❤️', soundCue: 'H seperti Hati', color: 'from-red-400 to-pink-500' },
  { letter: 'I', isVowel: true, word: 'Ikan', syllables: ['I', 'kan'], emoji: '🐟', soundCue: 'I seperti Ikan', color: 'from-sky-400 to-blue-500' },
  { letter: 'J', isVowel: false, word: 'Jam', syllables: ['Jam'], emoji: '⏰', soundCue: 'J seperti Jam', color: 'from-purple-400 to-indigo-500' },
  { letter: 'K', isVowel: false, word: 'Kuda', syllables: ['Ku', 'da'], emoji: '🐴', soundCue: 'K seperti Kuda', color: 'from-amber-500 to-yellow-600' },
  { letter: 'L', isVowel: false, word: 'Labu', syllables: ['La', 'bu'], emoji: '🎃', soundCue: 'L seperti Labu', color: 'from-orange-400 to-amber-500' },
  { letter: 'M', isVowel: false, word: 'Mata', syllables: ['Ma', 'ta'], emoji: '👀', soundCue: 'M seperti Mata', color: 'from-teal-400 to-emerald-500' },
  { letter: 'N', isVowel: false, word: 'Nanas', syllables: ['Na', 'nas'], emoji: '🍍', soundCue: 'N seperti Nanas', color: 'from-yellow-400 to-amber-500' },
  { letter: 'O', isVowel: true, word: 'Onta', syllables: ['On', 'ta'], emoji: '🐪', soundCue: 'O seperti Onta', color: 'from-orange-400 to-amber-600' },
  { letter: 'P', isVowel: false, word: 'Pisang', syllables: ['Pi', 'sang'], emoji: '🍌', soundCue: 'P seperti Pisang', color: 'from-yellow-400 to-lime-500' },
  { letter: 'Q', isVowel: false, word: 'Quran', syllables: ['Qu', 'ran'], emoji: '📖', soundCue: 'Q seperti Quran', color: 'from-emerald-400 to-green-600' },
  { letter: 'R', isVowel: false, word: 'Roti', syllables: ['Ro', 'ti'], emoji: '🍞', soundCue: 'R seperti Roti', color: 'from-amber-400 to-orange-500' },
  { letter: 'S', isVowel: false, word: 'Susu', syllables: ['Su', 'su'], emoji: '🥛', soundCue: 'S seperti Susu', color: 'from-blue-400 to-sky-500' },
  { letter: 'T', isVowel: false, word: 'Topi', syllables: ['To', 'pi'], emoji: '🧢', soundCue: 'T seperti Topi', color: 'from-indigo-400 to-purple-500' },
  { letter: 'U', isVowel: true, word: 'Ular', syllables: ['U', 'lar'], emoji: '🐍', soundCue: 'U seperti Ular', color: 'from-lime-400 to-emerald-500' },
  { letter: 'V', isVowel: false, word: 'Vas', syllables: ['Vas'], emoji: '🏺', soundCue: 'V seperti Vas Bunga', color: 'from-fuchsia-400 to-pink-500' },
  { letter: 'W', isVowel: false, word: 'Wortel', syllables: ['Wor', 'tel'], emoji: '🥕', soundCue: 'W seperti Wortel', color: 'from-orange-500 to-red-500' },
  { letter: 'X', isVowel: false, word: 'Xilofon', syllables: ['Xi', 'lo', 'fon'], emoji: '🎼', soundCue: 'X seperti Xilofon', color: 'from-violet-400 to-purple-500' },
  { letter: 'Y', isVowel: false, word: 'Yoyo', syllables: ['Yo', 'yo'], emoji: '🪀', soundCue: 'Y seperti Yoyo', color: 'from-rose-400 to-red-500' },
  { letter: 'Z', isVowel: false, word: 'Zebra', syllables: ['Zeb', 'ra'], emoji: '🦓', soundCue: 'Z seperti Zebra', color: 'from-slate-500 to-zinc-700' },
];

// 2. DATA SUKU KATA TERBUKA (Konsonan + a, i, u, e, o)
export const SYLLABLE_GROUPS: SyllableGroup[] = [
  {
    consonant: 'B',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    syllables: [
      { syllable: 'ba', vowel: 'a', sampleWord: 'baju', sampleEmoji: '👕' },
      { syllable: 'bi', vowel: 'i', sampleWord: 'bibir', sampleEmoji: '👄' },
      { syllable: 'bu', vowel: 'u', sampleWord: 'buku', sampleEmoji: '📚' },
      { syllable: 'be', vowel: 'e', sampleWord: 'bebek', sampleEmoji: '🦆' },
      { syllable: 'bo', vowel: 'o', sampleWord: 'bola', sampleEmoji: '⚽' },
    ],
  },
  {
    consonant: 'C',
    color: 'bg-rose-100 text-rose-700 border-rose-300',
    syllables: [
      { syllable: 'ca', vowel: 'a', sampleWord: 'cacing', sampleEmoji: '🪱' },
      { syllable: 'ci', vowel: 'i', sampleWord: 'cincin', sampleEmoji: '💍' },
      { syllable: 'cu', vowel: 'u', sampleWord: 'cumi', sampleEmoji: '🦑' },
      { syllable: 'ce', vowel: 'e', sampleWord: 'ceri', sampleEmoji: '🍒' },
      { syllable: 'co', vowel: 'o', sampleWord: 'cokelat', sampleEmoji: '🍫' },
    ],
  },
  {
    consonant: 'D',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    syllables: [
      { syllable: 'da', vowel: 'a', sampleWord: 'dadu', sampleEmoji: '🎲' },
      { syllable: 'di', vowel: 'i', sampleWord: 'dinding', sampleEmoji: '🧱' },
      { syllable: 'du', vowel: 'u', sampleWord: 'durian', sampleEmoji: '🍈' },
      { syllable: 'de', vowel: 'e', sampleWord: 'delman', sampleEmoji: '🐎' },
      { syllable: 'do', vowel: 'o', sampleWord: 'donat', sampleEmoji: '🍩' },
    ],
  },
  {
    consonant: 'G',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    syllables: [
      { syllable: 'ga', vowel: 'a', sampleWord: 'gajah', sampleEmoji: '🐘' },
      { syllable: 'gi', vowel: 'i', sampleWord: 'gigi', sampleEmoji: '🦷' },
      { syllable: 'gu', vowel: 'u', sampleWord: 'gula', sampleEmoji: '🍬' },
      { syllable: 'ge', vowel: 'e', sampleWord: 'gelas', sampleEmoji: '🥛' },
      { syllable: 'go', vowel: 'o', sampleWord: 'gol', sampleEmoji: '🥅' },
    ],
  },
  {
    consonant: 'K',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    syllables: [
      { syllable: 'ka', vowel: 'a', sampleWord: 'kaki', sampleEmoji: '🦶' },
      { syllable: 'ki', vowel: 'i', sampleWord: 'kijang', sampleEmoji: '🦌' },
      { syllable: 'ku', vowel: 'u', sampleWord: 'kuda', sampleEmoji: '🐴' },
      { syllable: 'ke', vowel: 'e', sampleWord: 'kelinci', sampleEmoji: '🐰' },
      { syllable: 'ko', vowel: 'o', sampleWord: 'kopi', sampleEmoji: '☕' },
    ],
  },
  {
    consonant: 'L',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    syllables: [
      { syllable: 'la', vowel: 'a', sampleWord: 'labu', sampleEmoji: '🎃' },
      { syllable: 'li', vowel: 'i', sampleWord: 'lilin', sampleEmoji: '🕯️' },
      { syllable: 'lu', vowel: 'u', sampleWord: 'lumba', sampleEmoji: '🐬' },
      { syllable: 'le', vowel: 'e', sampleWord: 'lemon', sampleEmoji: '🍋' },
      { syllable: 'lo', vowel: 'o', sampleWord: 'lorong', sampleEmoji: '🚪' },
    ],
  },
  {
    consonant: 'M',
    color: 'bg-teal-100 text-teal-700 border-teal-300',
    syllables: [
      { syllable: 'ma', vowel: 'a', sampleWord: 'mata', sampleEmoji: '👀' },
      { syllable: 'mi', vowel: 'i', sampleWord: 'mie', sampleEmoji: '🍜' },
      { syllable: 'mu', vowel: 'u', sampleWord: 'mulut', sampleEmoji: '👄' },
      { syllable: 'me', vowel: 'e', sampleWord: 'meja', sampleEmoji: '🪑' },
      { syllable: 'mo', vowel: 'o', sampleWord: 'mobil', sampleEmoji: '🚗' },
    ],
  },
  {
    consonant: 'N',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    syllables: [
      { syllable: 'na', vowel: 'a', sampleWord: 'nanas', sampleEmoji: '🍍' },
      { syllable: 'ni', vowel: 'i', sampleWord: 'nila', sampleEmoji: '🐟' },
      { syllable: 'nu', vowel: 'u', sampleWord: 'nuri', sampleEmoji: '🦜' },
      { syllable: 'ne', vowel: 'e', sampleWord: 'nenek', sampleEmoji: '👵' },
      { syllable: 'no', vowel: 'o', sampleWord: 'nomor', sampleEmoji: '🔢' },
    ],
  },
  {
    consonant: 'P',
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    syllables: [
      { syllable: 'pa', vowel: 'a', sampleWord: 'padi', sampleEmoji: '🌾' },
      { syllable: 'pi', vowel: 'i', sampleWord: 'pipi', sampleEmoji: '😊' },
      { syllable: 'pu', vowel: 'u', sampleWord: 'pulpen', sampleEmoji: '🖊️' },
      { syllable: 'pe', vowel: 'e', sampleWord: 'pesawat', sampleEmoji: '✈️' },
      { syllable: 'po', vowel: 'o', sampleWord: 'pohon', sampleEmoji: '🌳' },
    ],
  },
  {
    consonant: 'R',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    syllables: [
      { syllable: 'ra', vowel: 'a', sampleWord: 'radio', sampleEmoji: '📻' },
      { syllable: 'ri', vowel: 'i', sampleWord: 'rimba', sampleEmoji: '🌲' },
      { syllable: 'ru', vowel: 'u', sampleWord: 'rumah', sampleEmoji: '🏠' },
      { syllable: 're', vowel: 'e', sampleWord: 'reog', sampleEmoji: '🎭' },
      { syllable: 'ro', vowel: 'o', sampleWord: 'roti', sampleEmoji: '🍞' },
    ],
  },
  {
    consonant: 'S',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    syllables: [
      { syllable: 'sa', vowel: 'a', sampleWord: 'sapu', sampleEmoji: '🧹' },
      { syllable: 'si', vowel: 'i', sampleWord: 'singa', sampleEmoji: '🦁' },
      { syllable: 'su', vowel: 'u', sampleWord: 'susu', sampleEmoji: '🥛' },
      { syllable: 'se', vowel: 'e', sampleWord: 'sepatu', sampleEmoji: '👟' },
      { syllable: 'so', vowel: 'o', sampleWord: 'sosis', sampleEmoji: '🌭' },
    ],
  },
  {
    consonant: 'T',
    color: 'bg-lime-100 text-lime-800 border-lime-300',
    syllables: [
      { syllable: 'ta', vowel: 'a', sampleWord: 'tali', sampleEmoji: '🪢' },
      { syllable: 'ti', vowel: 'i', sampleWord: 'tikus', sampleEmoji: '🐭' },
      { syllable: 'tu', vowel: 'u', sampleWord: 'tupai', sampleEmoji: '🐿️' },
      { syllable: 'te', vowel: 'e', sampleWord: 'teh', sampleEmoji: '🍵' },
      { syllable: 'to', vowel: 'o', sampleWord: 'topi', sampleEmoji: '🧢' },
    ],
  },
];

// 3. DATA KATA BERGAMBAR (Level 1: 2 Suku Kata, Level 2: 3 Suku Kata)
export const READING_WORDS: ReadingWord[] = [
  // 2 Suku Kata
  { id: 'w1', word: 'baju', syllables: ['ba', 'ju'], emoji: '👕', category: 'benda', level: 1, phoneticHint: 'ba-ju' },
  { id: 'w2', word: 'bola', syllables: ['bo', 'la'], emoji: '⚽', category: 'benda', level: 1, phoneticHint: 'bo-la' },
  { id: 'w3', word: 'buku', syllables: ['bu', 'ku'], emoji: '📚', category: 'benda', level: 1, phoneticHint: 'bu-ku' },
  { id: 'w4', word: 'kaki', syllables: ['ka', 'ki'], emoji: '🦶', category: 'tubuh', level: 1, phoneticHint: 'ka-ki' },
  { id: 'w5', word: 'kuda', syllables: ['ku', 'da'], emoji: '🐴', category: 'hewan', level: 1, phoneticHint: 'ku-da' },
  { id: 'w6', word: 'mata', syllables: ['ma', 'ta'], emoji: '👀', category: 'tubuh', level: 1, phoneticHint: 'ma-ta' },
  { id: 'w7', word: 'meja', syllables: ['me', 'ja'], emoji: '🪑', category: 'benda', level: 1, phoneticHint: 'me-ja' },
  { id: 'w8', word: 'roti', syllables: ['ro', 'ti'], emoji: '🍞', category: 'makanan', level: 1, phoneticHint: 'ro-ti' },
  { id: 'w9', word: 'susu', syllables: ['su', 'su'], emoji: '🥛', category: 'makanan', level: 1, phoneticHint: 'su-su' },
  { id: 'w10', word: 'topi', syllables: ['to', 'pi'], emoji: '🧢', category: 'benda', level: 1, phoneticHint: 'to-pi' },
  { id: 'w11', word: 'gigi', syllables: ['gi', 'gi'], emoji: '🦷', category: 'tubuh', level: 1, phoneticHint: 'gi-gi' },
  { id: 'w12', word: 'dadu', syllables: ['da', 'du'], emoji: '🎲', category: 'benda', level: 1, phoneticHint: 'da-du' },
  { id: 'w13', word: 'ceri', syllables: ['ce', 'ri'], emoji: '🍒', category: 'makanan', level: 1, phoneticHint: 'ce-ri' },
  { id: 'w14', word: 'sapu', syllables: ['sa', 'pu'], emoji: '🧹', category: 'benda', level: 1, phoneticHint: 'sa-pu' },
  { id: 'w15', word: 'pita', syllables: ['pi', 'ta'], emoji: '🎀', category: 'benda', level: 1, phoneticHint: 'pi-ta' },
  { id: 'w16', word: 'madu', syllables: ['ma', 'du'], emoji: '🍯', category: 'makanan', level: 1, phoneticHint: 'ma-du' },

  // 3 Suku Kata
  { id: 'w17', word: 'sepatu', syllables: ['se', 'pa', 'tu'], emoji: '👟', category: 'benda', level: 2, phoneticHint: 'se-pa-tu' },
  { id: 'w18', word: 'kereta', syllables: ['ke', 're', 'ta'], emoji: '🚂', category: 'benda', level: 2, phoneticHint: 'ke-re-ta' },
  { id: 'w19', word: 'sepeda', syllables: ['se', 'pe', 'da'], emoji: '🚲', category: 'benda', level: 2, phoneticHint: 'se-pe-da' },
  { id: 'w20', word: 'kelapa', syllables: ['ke', 'la', 'pa'], emoji: '🥥', category: 'makanan', level: 2, phoneticHint: 'ke-la-pa' },
  { id: 'w21', word: 'boneka', syllables: ['bo', 'ne', 'ka'], emoji: '🧸', category: 'benda', level: 2, phoneticHint: 'bo-ne-ka' },
  { id: 'w22', word: 'kelinci', syllables: ['ke', 'lin', 'ci'], emoji: '🐰', category: 'hewan', level: 2, phoneticHint: 'ke-lin-ci' },
];

// 4. DATA KALIMAT SEDERHANA (30 Kalimat Latihan Membaca Anak TK)
export const SIMPLE_SENTENCES: SimpleSentence[] = [
  // --- Kategori: Keluarga & Rumah ---
  {
    id: 's1',
    sentence: 'ini buku budi',
    words: [
      { word: 'ini', syllables: ['i', 'ni'] },
      { word: 'buku', syllables: ['bu', 'ku'] },
      { word: 'budi', syllables: ['bu', 'di'] },
    ],
    meaningEmoji: '📖👦',
    category: 'keluarga',
  },
  {
    id: 's2',
    sentence: 'ibu beli roti',
    words: [
      { word: 'ibu', syllables: ['i', 'bu'] },
      { word: 'beli', syllables: ['be', 'li'] },
      { word: 'roti', syllables: ['ro', 'ti'] },
    ],
    meaningEmoji: '👩🍞',
    category: 'keluarga',
  },
  {
    id: 's3',
    sentence: 'ayah baca koran',
    words: [
      { word: 'ayah', syllables: ['a', 'yah'] },
      { word: 'baca', syllables: ['ba', 'ca'] },
      { word: 'koran', syllables: ['ko', 'ran'] },
    ],
    meaningEmoji: '👨📰',
    category: 'keluarga',
  },
  {
    id: 's4',
    sentence: 'adik minum susu',
    words: [
      { word: 'adik', syllables: ['a', 'dik'] },
      { word: 'minum', syllables: ['mi', 'num'] },
      { word: 'susu', syllables: ['su', 'su'] },
    ],
    meaningEmoji: '👶🥛',
    category: 'keluarga',
  },
  {
    id: 's5',
    sentence: 'kakak cuci baju',
    words: [
      { word: 'kakak', syllables: ['ka', 'kak'] },
      { word: 'cuci', syllables: ['cu', 'ci'] },
      { word: 'baju', syllables: ['ba', 'ju'] },
    ],
    meaningEmoji: '👧👕',
    category: 'keluarga',
  },
  {
    id: 's6',
    sentence: 'kakek tanam bunga',
    words: [
      { word: 'kakek', syllables: ['ka', 'kek'] },
      { word: 'tanam', syllables: ['ta', 'nam'] },
      { word: 'bunga', syllables: ['bu', 'nga'] },
    ],
    meaningEmoji: '👴🌻',
    category: 'keluarga',
  },

  // --- Kategori: Hewan Lucu ---
  {
    id: 's7',
    sentence: 'kuda lari cepat',
    words: [
      { word: 'kuda', syllables: ['ku', 'da'] },
      { word: 'lari', syllables: ['la', 'ri'] },
      { word: 'cepat', syllables: ['ce', 'pat'] },
    ],
    meaningEmoji: '🐴💨',
    category: 'hewan',
  },
  {
    id: 's8',
    sentence: 'kucing suka ikan',
    words: [
      { word: 'kucing', syllables: ['ku', 'cing'] },
      { word: 'suka', syllables: ['su', 'ka'] },
      { word: 'ikan', syllables: ['i', 'kan'] },
    ],
    meaningEmoji: '🐱🐟',
    category: 'hewan',
  },
  {
    id: 's9',
    sentence: 'sapi makan rumput',
    words: [
      { word: 'sapi', syllables: ['sa', 'pi'] },
      { word: 'makan', syllables: ['ma', 'kan'] },
      { word: 'rumput', syllables: ['rum', 'put'] },
    ],
    meaningEmoji: '🐮🌿',
    category: 'hewan',
  },
  {
    id: 's10',
    sentence: 'bebek suka renang',
    words: [
      { word: 'bebek', syllables: ['be', 'bek'] },
      { word: 'suka', syllables: ['su', 'ka'] },
      { word: 'renang', syllables: ['re', 'nang'] },
    ],
    meaningEmoji: '🦆💦',
    category: 'hewan',
  },
  {
    id: 's11',
    sentence: 'kelinci lompat riang',
    words: [
      { word: 'kelinci', syllables: ['ke', 'lin', 'ci'] },
      { word: 'lompat', syllables: ['lom', 'pat'] },
      { word: 'riang', syllables: ['ri', 'ang'] },
    ],
    meaningEmoji: '🐰🌸',
    category: 'hewan',
  },
  {
    id: 's12',
    sentence: 'ikan hias berenang',
    words: [
      { word: 'ikan', syllables: ['i', 'kan'] },
      { word: 'hias', syllables: ['hi', 'as'] },
      { word: 'berenang', syllables: ['be', 're', 'nang'] },
    ],
    meaningEmoji: '🐠🌊',
    category: 'hewan',
  },

  // --- Kategori: Makanan & Minuman ---
  {
    id: 's13',
    sentence: 'saya suka susu',
    words: [
      { word: 'saya', syllables: ['sa', 'ya'] },
      { word: 'suka', syllables: ['su', 'ka'] },
      { word: 'susu', syllables: ['su', 'su'] },
    ],
    meaningEmoji: '🧒🥛',
    category: 'makanan',
  },
  {
    id: 's14',
    sentence: 'ani makan apel',
    words: [
      { word: 'ani', syllables: ['a', 'ni'] },
      { word: 'makan', syllables: ['ma', 'kan'] },
      { word: 'apel', syllables: ['a', 'pel'] },
    ],
    meaningEmoji: '👧🍎',
    category: 'makanan',
  },
  {
    id: 's15',
    sentence: 'dini kupas pisang',
    words: [
      { word: 'dini', syllables: ['di', 'ni'] },
      { word: 'kupas', syllables: ['ku', 'pas'] },
      { word: 'pisang', syllables: ['pi', 'sang'] },
    ],
    meaningEmoji: '👧🍌',
    category: 'makanan',
  },
  {
    id: 's16',
    sentence: 'budi minum madu',
    words: [
      { word: 'budi', syllables: ['bu', 'di'] },
      { word: 'minum', syllables: ['mi', 'num'] },
      { word: 'madu', syllables: ['ma', 'du'] },
    ],
    meaningEmoji: '👦🍯',
    category: 'makanan',
  },
  {
    id: 's17',
    sentence: 'mama masak nasi',
    words: [
      { word: 'mama', syllables: ['ma', 'ma'] },
      { word: 'masak', syllables: ['ma', 'sak'] },
      { word: 'nasi', syllables: ['na', 'si'] },
    ],
    meaningEmoji: '👩🍚',
    category: 'makanan',
  },
  {
    id: 's18',
    sentence: 'roti tawar manis',
    words: [
      { word: 'roti', syllables: ['ro', 'ti'] },
      { word: 'tawar', syllables: ['ta', 'war'] },
      { word: 'manis', syllables: ['ma', 'nis'] },
    ],
    meaningEmoji: '🍞🍯',
    category: 'makanan',
  },

  // --- Kategori: Main & Beraktivitas ---
  {
    id: 's19',
    sentence: 'budi main bola',
    words: [
      { word: 'budi', syllables: ['bu', 'di'] },
      { word: 'main', syllables: ['ma', 'in'] },
      { word: 'bola', syllables: ['bo', 'la'] },
    ],
    meaningEmoji: '👦⚽',
    category: 'aktivitas',
  },
  {
    id: 's20',
    sentence: 'rudi naik sepeda',
    words: [
      { word: 'rudi', syllables: ['ru', 'di'] },
      { word: 'naik', syllables: ['na', 'ik'] },
      { word: 'sepeda', syllables: ['se', 'pe', 'da'] },
    ],
    meaningEmoji: '👦🚲',
    category: 'aktivitas',
  },
  {
    id: 's21',
    sentence: 'rani punya boneka',
    words: [
      { word: 'rani', syllables: ['ra', 'ni'] },
      { word: 'punya', syllables: ['pu', 'nya'] },
      { word: 'boneka', syllables: ['bo', 'ne', 'ka'] },
    ],
    meaningEmoji: '👧🧸',
    category: 'aktivitas',
  },
  {
    id: 's22',
    sentence: 'doni tarik tali',
    words: [
      { word: 'doni', syllables: ['do', 'ni'] },
      { word: 'tarik', syllables: ['ta', 'rik'] },
      { word: 'tali', syllables: ['ta', 'li'] },
    ],
    meaningEmoji: '👦🪢',
    category: 'aktivitas',
  },
  {
    id: 's23',
    sentence: 'kami suka baca',
    words: [
      { word: 'kami', syllables: ['ka', 'mi'] },
      { word: 'suka', syllables: ['su', 'ka'] },
      { word: 'baca', syllables: ['ba', 'ca'] },
    ],
    meaningEmoji: '🎒📚',
    category: 'aktivitas',
  },
  {
    id: 's24',
    sentence: 'saya cuci tangan',
    words: [
      { word: 'saya', syllables: ['sa', 'ya'] },
      { word: 'cuci', syllables: ['cu', 'ci'] },
      { word: 'tangan', syllables: ['ta', 'ngan'] },
    ],
    meaningEmoji: '🧒🧼',
    category: 'aktivitas',
  },

  // --- Kategori: Benda & Lingkungan Sekitar ---
  {
    id: 's25',
    sentence: 'siti buka pintu',
    words: [
      { word: 'siti', syllables: ['si', 'ti'] },
      { word: 'buka', syllables: ['bu', 'ka'] },
      { word: 'pintu', syllables: ['pin', 'tu'] },
    ],
    meaningEmoji: '👧🚪',
    category: 'lingkungan',
  },
  {
    id: 's26',
    sentence: 'bunga mekar wangi',
    words: [
      { word: 'bunga', syllables: ['bu', 'nga'] },
      { word: 'mekar', syllables: ['me', 'kar'] },
      { word: 'wangi', syllables: ['wa', 'ngi'] },
    ],
    meaningEmoji: '🌺✨',
    category: 'lingkungan',
  },
  {
    id: 's27',
    sentence: 'sepatu baru budi',
    words: [
      { word: 'sepatu', syllables: ['se', 'pa', 'tu'] },
      { word: 'baru', syllables: ['ba', 'ru'] },
      { word: 'budi', syllables: ['bu', 'di'] },
    ],
    meaningEmoji: '👟⭐',
    category: 'lingkungan',
  },
  {
    id: 's28',
    sentence: 'burung terbang tinggi',
    words: [
      { word: 'burung', syllables: ['bu', 'rung'] },
      { word: 'terbang', syllables: ['ter', 'bang'] },
      { word: 'tinggi', syllables: ['ting', 'gi'] },
    ],
    meaningEmoji: '🐦🌤️',
    category: 'lingkungan',
  },
  {
    id: 's29',
    sentence: 'rumah kami bersih',
    words: [
      { word: 'rumah', syllables: ['ru', 'mah'] },
      { word: 'kami', syllables: ['ka', 'mi'] },
      { word: 'bersih', syllables: ['ber', 'sih'] },
    ],
    meaningEmoji: '🏡✨',
    category: 'lingkungan',
  },
  {
    id: 's30',
    sentence: 'matahari terbit pagi',
    words: [
      { word: 'matahari', syllables: ['ma', 'ta', 'ha', 'ri'] },
      { word: 'terbit', syllables: ['ter', 'bit'] },
      { word: 'pagi', syllables: ['pa', 'gi'] },
    ],
    meaningEmoji: '☀️🌅',
    category: 'lingkungan',
  },
];

// 5. STIKER PRESTASI / PENGHARGAAN
export const STICKER_COLLECTION: Sticker[] = [
  { id: 'stk_1', title: 'Langkah Pertama', description: 'Memulai petualangan membaca', emoji: '🌱', unlockedAtStars: 1 },
  { id: 'stk_2', title: 'Bintang Vokal', description: 'Mengenal huruf A, I, U, E, O', emoji: '⭐', unlockedAtStars: 5 },
  { id: 'stk_3', title: 'Jagoan Huruf', description: 'Mempelajari 10 huruf alfabet', emoji: '🦁', unlockedAtStars: 10 },
  { id: 'stk_4', title: 'Teman Suku Kata', description: 'Mengeja suku kata ba-bi-bu', emoji: '🐥', unlockedAtStars: 18 },
  { id: 'stk_5', title: 'Pembaca Hebat', description: 'Membaca 10 kata bergambar', emoji: '🚀', unlockedAtStars: 25 },
  { id: 'stk_6', title: 'Detektif Kata', description: 'Menyelesaikan kuis tanpa salah', emoji: '🕵️', unlockedAtStars: 35 },
  { id: 'stk_7', title: 'Kutu Buku Cilik', description: 'Membaca kalimat pendek lancar', emoji: '📚', unlockedAtStars: 50 },
  { id: 'stk_8', title: 'Juara Bintang Emas', description: 'Mengumpulkan 75 bintang kehormatan', emoji: '👑', unlockedAtStars: 75 },
];
