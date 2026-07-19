<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  let itemCost = 0;
  let extraCosts: { description: string; amount: number }[] = [];

  $: totalExtraCost = extraCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  $: totalCost = (itemCost || 0) + totalExtraCost;

  function addExtraCost() {
    extraCosts = [...extraCosts, { description: '', amount: 0 }];
  }

  function removeExtraCost(index: number) {
    extraCosts = extraCosts.filter((_, i) => i !== index);
  }
</script>

<svelte:head>
  <title>Add Maintenance Event</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <div class="flex items-center my-6">
      <a href="/cars/{data.carId}/items/{data.itemId}/events" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">Add Maintenance Event</h2>
    </div>

    <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 flex flex-col lg:flex-row gap-8">
      <form on:submit|preventDefault class="flex-1">
        <!-- Maintenance Date -->
        <label class="block text-sm">
          <span class="text-gray-700 dark:text-gray-400">Maintenance Date</span>
          <input
            type="date"
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            required
          />
        </label>

        <!-- KM Counter -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">KM Counter</span>
          <input
            type="number"
            min="0"
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            placeholder="54000"
            required
          />
        </label>

        <!-- Item Cost -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Item Cost ($)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            bind:value={itemCost}
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            placeholder="150.00"
            required
          />
        </label>

        <!-- Extra Costs -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-400">Extra Costs</span>
            <button
              type="button"
              on:click={addExtraCost}
              class="px-3 py-1 text-xs font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              + Add Extra
            </button>
          </div>
          
          {#if extraCosts.length > 0}
            <div class="space-y-3">
              {#each extraCosts as extra, i}
                <div class="flex items-center gap-4">
                  <input
                    type="text"
                    bind:value={extra.description}
                    placeholder="Description (e.g., Labor)"
                    class="block w-full text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    bind:value={extra.amount}
                    placeholder="Amount"
                    class="block w-32 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    required
                  />
                  <button
                    type="button"
                    on:click={() => removeExtraCost(i)}
                    class="p-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-red-400 focus:outline-none focus:shadow-outline-gray hover:bg-red-100 dark:hover:bg-red-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-gray-500 dark:text-gray-400 italic">No extra costs added.</p>
          {/if}
        </div>

        <!-- Notes -->
        <label class="block mt-6 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Notes</span>
          <textarea
            class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
            rows="3"
            placeholder="Regular maintenance..."
          ></textarea>
        </label>

        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Save Event
          </button>
        </div>
      </form>

      <!-- Summary Card -->
      <div class="lg:w-1/3 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg self-start sticky top-6">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Cost Summary</h3>
        <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex justify-between">
            <span>Item Cost</span>
            <span>$ {itemCost.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-gray-500 dark:text-gray-500">
            <span>+ Extra Costs</span>
            <span>$ {totalExtraCost.toFixed(2)}</span>
          </div>
          <hr class="border-gray-200 dark:border-gray-600" />
          <div class="flex justify-between text-lg font-bold text-gray-800 dark:text-gray-200">
            <span>Total Cost</span>
            <span>$ {totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
