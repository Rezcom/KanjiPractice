import type { Question } from "./types";

export function getQuestionString(question: Question | undefined): string {
  if (!question) {
    return "Undefined";
  }
  return question.questionType === "english"
    ? question.term.English
    : question.term.Kana;
}
