<script lang="ts">
  import KanjiPractice from "./KanjiPractice.svelte";

  let windowState: "Menu" | "Practice" = $state("Menu");
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
  </div>
{:else}
  <KanjiPractice
    finished={() => {
      windowState = "Menu";
    }}
  />
{/if}
