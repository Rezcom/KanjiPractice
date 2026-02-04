import type { Question, QuestionType } from "./types";

export const promptStrings: Record<QuestionType, string> = {
  english: "Write the kanji and hiragana.",
  kana: "Write the kanji and translate.",
  kanji: "Write the hiragana and translate.",
};

export function getQuestionString(question: Question | undefined): string {
  if (!question) {
    return "Undefined";
  }
  return question.questionType === "english"
    ? question.term.English
    : question.term.Kana;
}

export function isQuestionFinished(
  question: Question,
  maxCorrect: number,
): boolean {
  return question.correct >= maxCorrect;
}
