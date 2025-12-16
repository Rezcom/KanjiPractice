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
  questionTypes: Record<QuestionType, boolean>
): boolean {
  const englishDone =
    !questionTypes.english || question.englishCorrect >= maxCorrect;
  const kanaDone = !questionTypes.kana || question.kanaCorrect >= maxCorrect;

  return englishDone && kanaDone;
}

export function getNewQuestionType(
  question: Question,
  maxCorrect: number,
  questionTypes: Record<QuestionType, boolean>
): QuestionType | null {
  const needsEnglish =
    questionTypes.english && question.englishCorrect < maxCorrect;
  const needsKana = questionTypes.kana && question.kanaCorrect < maxCorrect;

  if (needsEnglish) return "english";
  if (needsKana) return "kana";
  return null;
}
