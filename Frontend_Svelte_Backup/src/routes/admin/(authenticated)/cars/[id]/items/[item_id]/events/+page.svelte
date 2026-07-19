<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>Maintenance Events - {data.item.name}</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <!-- Header -->
    <div class="flex items-center my-6">
      <a href="/cars/{data.item.carId}" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Maintenance History - {data.item.name}
      </h2>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end mb-4">
      <a
        href="/cars/{data.item.carId}/items/{data.item.id}/events/add"
        class="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
      >
        <span>Add Maintenance Event</span>
        <svg class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </a>
    </div>

    <!-- Events Table -->
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-no-wrap">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">KM Counter</th>
              <th class="px-4 py-3">Item Cost</th>
              <th class="px-4 py-3">Extra Costs</th>
              <th class="px-4 py-3">Total Cost</th>
              <th class="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {#each data.events as event}
              {@const totalExtra = event.extraCosts.reduce((sum, cost) => sum + cost.cost, 0)}
              {@const totalCost = event.itemCost + totalExtra}
              <tr class="text-gray-700 dark:text-gray-400">
                <td class="px-4 py-3 text-sm font-semibold"> {event.maintenanceDate} </td>
                <td class="px-4 py-3 text-sm"> {event.kmCounter.toLocaleString()} KM </td>
                <td class="px-4 py-3 text-sm"> $ {event.itemCost} </td>
                <td class="px-4 py-3 text-sm">
                  {#if event.extraCosts.length > 0}
                    <div class="flex flex-col gap-1 text-xs">
                      {#each event.extraCosts as extra}
                        <span>{extra.name}: ${extra.cost}</span>
                      {/each}
                    </div>
                  {:else}
                    -
                  {/if}
                </td>
                <td class="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-300"> $ {totalCost} </td>
                <td class="px-4 py-3 text-sm"> {event.notes || '-'} </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</main>
