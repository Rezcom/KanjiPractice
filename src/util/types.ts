export type QuestionType = "kana" | "english" | "kanji";

export interface VocabSet {
  vocab: Term[];
}

export interface Question {
  term: Term;
  questionType: QuestionType;
  englishCorrect: number;
  kanaCorrect: number;
  attempts: number;
}

interface Term {
  Kanji?: string;
  Kana: string;
  English: string;
}
