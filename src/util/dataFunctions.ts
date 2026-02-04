import ankiData from "@vocab/anki.json";
import type { Question, QuestionType, VocabSet } from "./types";

export function loadAllSets(
  selectedSets: { anki: boolean },
  questionTypes: Record<QuestionType, boolean>,
): Question[] {
  const allSets: Record<string, VocabSet> = {
    anki: ankiData,
  };

  return Object.entries(selectedSets)
    .filter(([_, isSelected]) => isSelected)
    .flatMap(([setName]) => loadSet(allSets[setName], questionTypes));
}

export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array]; // copy to keep it immutable
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

function loadSet(
  vocabSet: VocabSet,
  questionTypes: Record<QuestionType, boolean>,
): Question[] {
  const enabledTypes = (Object.keys(questionTypes) as QuestionType[]).filter(
    (type) => questionTypes[type],
  );

  return vocabSet.vocab.flatMap((term) =>
    enabledTypes.map((type) => ({
      term,
      questionType: type,
      correct: 0,
      attempts: 0,
    })),
  );
}
