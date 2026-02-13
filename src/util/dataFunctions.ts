import ankiData from "@vocab/anki.json";
import foodData from "@vocab/food.json";
import songData from "@vocab/song.json";
import bodyData from "@vocab/body.json";
import type { Question, QuestionType, VocabSet, VocabSetlist } from "./types";

export function loadAllSets(
  useSets: VocabSetlist,
  questionTypes: Record<QuestionType, boolean>,
): Question[] {
  const allSets: Record<string, VocabSet> = {
    anki: ankiData,
    food: foodData,
    song: songData,
    body: bodyData,
  };

  return Object.entries(useSets)
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
