<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  let photoPreview: string | null = null;

  function handlePhotoSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      photoPreview = URL.createObjectURL(file);
    } else {
      photoPreview = null;
    }
  }
</script>

<svelte:head>
  <title>Add Item</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <div class="flex items-center my-6">
      <a href="/cars/{data.carId}" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">Add New Item</h2>
    </div>

    <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <form on:submit|preventDefault>
        <!-- Item Photo -->
        <label class="block mb-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Item Photo</span>
          <div class="mt-2 flex items-center gap-4">
            {#if photoPreview}
              <img src={photoPreview} alt="Preview" class="w-32 h-32 object-cover rounded-lg shadow-sm" />
            {:else}
              <div class="w-32 h-32 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-400">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            {/if}
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm dark:text-gray-300 focus:outline-none"
              on:change={handlePhotoSelect}
            />
          </div>
        </label>

        <!-- Name -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Name</span>
          <input
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            placeholder="Engine Oil"
            required
          />
        </label>

        <!-- Manufacturer -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Manufacturer</span>
          <input
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            placeholder="Castrol"
          />
        </label>

        <!-- Serial Number -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Serial Number</span>
          <input
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            placeholder="SN-123456"
          />
        </label>

        <!-- Installed Date -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Installed Date</span>
          <input
            type="date"
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
          />
        </label>

        <!-- Installed KM -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Installed KM</span>
          <input
            type="number"
            min="0"
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            placeholder="54000"
          />
        </label>

        <!-- Expected Maintenance KM -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Expected Maintenance KM (Interval)</span>
          <input
            type="number"
            min="0"
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            placeholder="10000"
          />
        </label>

        <!-- Expected Maintenance Months -->
        <label class="block mt-4 text-sm">
          <span class="text-gray-700 dark:text-gray-400">Expected Maintenance Months (Interval)</span>
          <input
            type="number"
            min="0"
            class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            placeholder="12"
          />
        </label>

        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  </div>
</main>
