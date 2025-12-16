<script lang="ts">
  import { loadAllSets, shuffle } from "@/util/dataFunctions";
  import {
    getNewQuestionType,
    getQuestionString,
    isQuestionFinished,
    promptStrings,
  } from "@/util/practiceFunctions";
  import type { Question, QuestionType } from "@/util/types";
  import { onMount } from "svelte";

  interface Props {
    // Sets to use
    useSets?: {
      anki: boolean;
    };
    questionTypes?: Record<QuestionType, boolean>;
    batchSize?: number;
    maxCorrect?: number;
    finished: () => void;
  }

  const {
    useSets = {
      anki: true,
    },
    batchSize = 10,
    maxCorrect = 1,
    questionTypes = {
      english: true,
      kana: false,
      kanji: false,
    },
    finished,
  }: Props = $props();

  let windowState: "Question" | "Answer" = $state("Question");

  let questionString = $state("Hello");
  let currentQuestion: Question | undefined = $state(undefined);
  let remainingQuestions: Question[] = $state([]);
  let currentBatch: Question[] = $state([]);
  let nextBatch: Question[] = $state([]);

  function getNextQuestion() {
    /*
     Gets the next question
     */

    windowState = "Question";

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

  function showAnswer() {
    windowState = "Answer";
  }

  function submitAnswer(correct: boolean) {
    if (currentQuestion) {
      currentQuestion.attempts += 1;
      if (correct) {
        // User got it correct

        switch (currentQuestion.questionType) {
          case "english":
            currentQuestion.englishCorrect += 1;
            break;
          case "kana":
            currentQuestion.kanaCorrect += 1;
            break;
        }

        if (isQuestionFinished(currentQuestion, maxCorrect, questionTypes)) {
          // Question is finished, do not add to next batch
        } else {
          // Question is unfinished, shuffle in to remaining batch
          const newQuestionType = getNewQuestionType(
            currentQuestion,
            maxCorrect,
            questionTypes
          );
          if (!newQuestionType) {
            console.error(
              "User does not need the question, but a new question type was called for anyway"
            );
            return;
          }
          currentQuestion.questionType = newQuestionType;
          remainingQuestions = [currentQuestion, ...remainingQuestions];
        }
      } else {
        // User got it wrong, reset correct stats and put it in next batch
        currentQuestion.englishCorrect = 0;
        currentQuestion.kanaCorrect = 0;
        nextBatch = [currentQuestion, ...nextBatch];
      }

      getNextQuestion();
    } else {
      console.error("Answer submitted with no current question selected");
    }
  }

  onMount(() => {
    // Load questions
    const allQuestions = shuffle(loadAllSets(useSets));

    currentBatch = allQuestions.slice(0, batchSize);
    remainingQuestions = allQuestions.slice(batchSize);
    getNextQuestion();
  });
</script>

<div class="text-white absolute">
  Remaining: {remainingQuestions.length}
  <br />
  Current: {currentBatch.length}
  <br />
  Next: {nextBatch.length}
</div>

{#if currentQuestion}
  <div class="flex flex-col mx-auto mt-10 max-w-5xl min-h-[60vh]">
    {#if windowState === "Question"}
      <div
        class={"text-white text-center ".concat(
          currentQuestion && currentQuestion.questionType === "english"
            ? "font-serif text-4xl"
            : "font-Yuji text-6xl"
        )}
      >
        {questionString}
      </div>
      <div class="my-10 text-center text-4xl text-blue-300">
        {promptStrings[currentQuestion.questionType]}
      </div>

      <div class="mx-auto">
        <button
          onclick={showAnswer}
          class="rounded-md p-4 bg-indigo-600 text-white text-xl hover:cursor-pointer hover:bg-indigo-800 hover:scale-110 transition duration-200"
          >Show Answer</button
        >
      </div>
    {:else}
      <div class="flex flex-col mx-auto mb-8">
        {#if currentQuestion?.term.Kanji}
          <div class="text-white text-center font-Yuji text-6xl mb-2">
            {currentQuestion.term.Kanji}
          </div>
        {/if}
        <div class="text-white text-center font-Yuji text-6xl mb-2">
          {currentQuestion?.term.Kana}
        </div>
        <div class="text-white text-center font-serif text-4xl">
          {currentQuestion?.term.English}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-1 mx-auto">
        <button
          onclick={() => {
            submitAnswer(true);
          }}
          class="rounded-md p-4 bg-green-600 text-white text-xl hover:cursor-pointer hover:bg-green-800 hover:scale-110 transition duration-200 mx-auto"
          >Correct</button
        >
        <button
          onclick={() => {
            submitAnswer(false);
          }}
          class="rounded-md p-4 bg-red-600 text-white text-xl hover:cursor-pointer hover:bg-red-800 hover:scale-110 transition duration-200 mx-auto"
          >Incorrect</button
        >
      </div>
    {/if}
  </div>
{:else}
  <div class="red-600 text-7xl font-bold">Undefined - No Question Selected</div>
{/if}
