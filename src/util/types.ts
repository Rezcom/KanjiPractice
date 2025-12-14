export interface VocabSet {
  vocab: Term[];
}

export interface Question {
  term: Term;
  questionType: "kana" | "english";
  englishCorrect: number;
  kanaCorrect: number;
  attempts: number;
}

interface Term {
  Kanji?: string;
  Kana: string;
  English: string;
}
