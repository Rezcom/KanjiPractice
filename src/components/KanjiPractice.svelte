<script lang="ts">
  import { loadAllSets, shuffle } from "@/util/dataFunctions";
  import { getQuestionString } from "@/util/practiceFunctions";
  import type { Question } from "@/util/types";
  import { onMount } from "svelte";

  interface Props {
    // Sets to use
    useSets?: {
      anki: boolean;
    };
    batchSize?: number;
    finished: () => void;
  }

  const {
    useSets = {
      anki: true,
    },
    batchSize = 10,
    finished,
  }: Props = $props();

  let questionString = $state("Hello");
  let currentQuestion: Question | undefined = $state(undefined);
  let remainingQuestions: Question[] = $state([]);
  let currentBatch: Question[] = $state([]);
  let nextBatch: Question[] = $state([]);

  function getNextQuestion() {
    // Reset batch if current batch is empty
    if (currentBatch.length === 0) {
      // If there is no next batch and no remaining questions, finished
      if (nextBatch.length === 0 && remainingQuestions.length === 0) {
        finished();
        return;
      }

      currentBatch = shuffle(nextBatch);
      nextBatch = [];

      // Add more questions to the upcoming batch if there aren't many questions left
      if (currentBatch.length < batchSize / 2 && remainingQuestions.length) {
        currentBatch = shuffle([
          ...currentBatch,
          ...remainingQuestions.slice(0, batchSize),
        ]);

        remainingQuestions =
          remainingQuestions.length < batchSize
            ? []
            : remainingQuestions.slice(batchSize);
      }
    }

    currentQuestion = currentBatch.pop();
    questionString = getQuestionString(currentQuestion);
  }

  onMount(() => {
    // Load questions
    const allQuestions = shuffle(loadAllSets(useSets));

    currentBatch = allQuestions.slice(0, batchSize);
    remainingQuestions = allQuestions.slice(batchSize);
    getNextQuestion();
  });
</script>

<div class="flex flex-col mx-auto mt-10 max-w-5xl min-h-[60vh]">
  <div class="font-Yuji text-white text-center text-6xl">
    {questionString}
  </div>
  <div class="mt-10 mx-auto">
    <button
      class="rounded-md p-4 bg-indigo-600 text-white text-xl hover:cursor-pointer hover:bg-indigo-800 hover:scale-110 transition duration-200"
      >Show Answer</button
    >
  </div>
</div>
