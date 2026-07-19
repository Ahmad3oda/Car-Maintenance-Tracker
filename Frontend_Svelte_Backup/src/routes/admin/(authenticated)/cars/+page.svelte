<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>Cars</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <div class="flex items-center justify-between my-6">
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">Cars</h2>
      <a
        href="/cars/add"
        class="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
      >
        <span>Add Car</span>
        <svg class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </a>
    </div>

    <!-- Cards grid -->
    <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
      {#each data.cars as car}
        <a href="/cars/{car.id}" class="block min-w-0 bg-white rounded-lg shadow-xs dark:bg-gray-800 hover:shadow-md transition-shadow">
          {#if car.photoPath}
            <img class="object-cover w-full h-48 rounded-t-lg" src={car.photoPath} alt="{car.brand} {car.model}" />
          {:else}
            <div class="flex items-center justify-center w-full h-48 bg-gray-200 rounded-t-lg dark:bg-gray-700">
              <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </div>
          {/if}
          <div class="p-4">
            <h4 class="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-300">
              {car.brand} {car.model} ({car.year})
            </h4>
            <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span class="px-2 py-1 font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-700">
                {car.plateNumber}
              </span>
              <span>{car.currentKm.toLocaleString()} KM</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</main>
