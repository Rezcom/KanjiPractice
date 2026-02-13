export type QuestionType = "kana" | "english" | "kanji";

export interface VocabSetlist {
  anki: boolean;
  food: boolean;
  song: boolean;
  body: boolean;
}

export interface VocabSet {
  vocab: Term[];
}

export interface Question {
  term: Term;
  questionType: QuestionType;
  correct: number;
  attempts: number;
}

interface Term {
  Kanji?: string;
  Kana: string;
  English: string;
}
