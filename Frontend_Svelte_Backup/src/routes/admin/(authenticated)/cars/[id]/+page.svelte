<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>Car Details - {data.car.brand} {data.car.model}</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <!-- Header -->
    <div class="flex items-center my-6">
      <a href="/cars" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">Car Details</h2>
    </div>

    <!-- Car Info Card -->
    <div class="flex flex-col md:flex-row items-center p-4 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      {#if data.car.photoPath}
        <img class="object-cover w-32 h-32 rounded-lg md:mr-6 mb-4 md:mb-0" src={data.car.photoPath} alt="{data.car.brand} {data.car.model}" />
      {:else}
        <div class="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-lg md:mr-6 mb-4 md:mb-0 dark:bg-gray-700">
           <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
             <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
           </svg>
        </div>
      {/if}
      <div class="flex-1 w-full flex flex-col md:flex-row justify-between">
        <div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">{data.car.brand} {data.car.model}</h3>
          <p class="text-gray-600 dark:text-gray-400">{data.car.year}</p>
          <div class="mt-2 flex gap-4">
            <span class="px-2 py-1 text-sm font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-700">
              {data.car.plateNumber}
            </span>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {data.car.currentKm.toLocaleString()} KM
            </span>
          </div>
        </div>
        <div class="mt-4 md:mt-0 flex items-center">
          <button class="px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray">
            Edit Car
          </button>
        </div>
      </div>
    </div>

    <!-- Items Section -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200">Installed Items</h3>
      <a
        href="/cars/{data.car.id}/items/add"
        class="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
      >
        <span>Add Item</span>
        <svg class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </a>
    </div>

    <!-- Items Table -->
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-no-wrap">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th class="px-4 py-3">Item Name</th>
              <th class="px-4 py-3">Manufacturer</th>
              <th class="px-4 py-3">Installed Date</th>
              <th class="px-4 py-3">Installed KM</th>
              <th class="px-4 py-3">Next Maint. KM</th>
              <th class="px-4 py-3">Next Maint. Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {#each data.items as item}
            <tr class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors" on:click={() => window.location.href = `/cars/${data.car.id}/items/${item.id}/events`}>
              <td class="px-4 py-3">
                <div class="flex items-center text-sm">
                  {#if item.photoPath}
                    <img class="object-cover w-8 h-8 rounded-full mr-3" src={item.photoPath} alt="" />
                  {:else}
                    <div class="w-8 h-8 rounded-full mr-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                       <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                  {/if}
                  <p class="font-semibold">{item.name}</p>
                </div>
              </td>
              <td class="px-4 py-3 text-sm"> {item.manufacturer} </td>
              <td class="px-4 py-3 text-sm"> {item.installedDate} </td>
              <td class="px-4 py-3 text-sm"> {item.installedKm} </td>
              <td class="px-4 py-3 text-sm"> {item.nextMaintenanceKm || '-'} </td>
              <td class="px-4 py-3 text-sm"> {item.nextMaintenanceDate || '-'} </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</main>
