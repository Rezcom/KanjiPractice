<script lang="ts">
  import type { VocabSetlist } from "@/util/types";
  import KanjiPractice from "./KanjiPractice.svelte";

  let useSets: VocabSetlist = $state({
    anki: false,
    food: false,
  });

  let windowState: "Menu" | "Practice" = $state("Menu");

  let askEnglish = $state(true);
  let askKana = $state(true);
  let askKanji = $state(false);

  const checkboxClass = "mt-1 rounded-sm text-green-600 bg-gray-200 mx-2";
</script>

{#if windowState === "Menu"}
  <div class="flex flex-col mx-auto mt-10">
    <div class="text-7xl text-white text-center font-Yuji">単語練習</div>
    <div class="mt-10 mx-auto">
      <button
        onclick={() => {
          windowState = "Practice";
        }}
        class="rounded-md p-4 bg-indigo-600 text-white text-xl hover:cursor-pointer hover:bg-indigo-800 hover:scale-110 transition duration-200"
      >
        Begin
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="flex flex-row">
        <input
          type="checkbox"
          bind:checked={useSets.anki}
          class={checkboxClass}
        />
        <span class="text-white">Anki 1</span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="flex flex-row">
        <input
          type="checkbox"
          bind:checked={useSets.food}
          class={checkboxClass}
        />
        <span class="text-white">Food</span>
      </div>
    </div>

    <!-- Question Types-->
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="flex flex-row">
        <input
          type="checkbox"
          bind:checked={askEnglish}
          class={checkboxClass}
        />
        <span class="text-white">Ask English</span>
      </div>
      <div class="flex flex-row">
        <input type="checkbox" bind:checked={askKana} class={checkboxClass} />
        <span class="text-white">Ask Kana</span>
      </div>
      <div class="flex flex-row">
        <input type="checkbox" bind:checked={askKanji} class={checkboxClass} />
        <span class="text-white">Ask Kanji</span>
      </div>
    </div>
  </div>
{:else}
  <KanjiPractice
    questionTypes={{
      english: askEnglish,
      kana: askKana,
      kanji: askKanji,
    }}
    finished={() => {
      windowState = "Menu";
    }}
    {useSets}
  />
{/if}
