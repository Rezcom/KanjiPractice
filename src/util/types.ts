export interface VocabSet {
  vocab: Term[];
}

export interface Question {
  term: Term;
  englishCorrect?: number;
  kanaCorrect?: number;
}

interface Term {
  Kanji?: string;
  Kana: string;
  English: string;
}
