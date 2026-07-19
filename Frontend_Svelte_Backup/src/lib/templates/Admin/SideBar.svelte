<script lang="ts">
	import { closeSideMenu, pageMenus, togglePageMenu, toggleSideMenu } from '$stores/menus'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'

	const appName = import.meta.env.VITE_APP_NAME

	$: changeLink = (link: any) => {
		closeSideMenu()
		goto(link.url)
	}

	$: isMainLink = (link: any) => {
		if (!link.url) {
			return false
		}
		return link.url === activeUrl.pathname
	}

	$: isChildLink = (link: any) => {
		if (!link.url) {
			return false
		}
		return activeUrl.pathname.indexOf(link.url, 0) >= 0
	}

	$: activeUrl = $page.url

	export let withTitle = true
	export let links = [
		{
			name: 'Dashboard',
			url: '/',
			svg: [
				'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
			]
		},
		{
			name: 'Cars',
			url: '/cars',
			svg: [
				'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
			]
		},
		{
			name: 'Settings',
			url: '/settings',
			svg: [
				'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
				'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
			]
		}
	]
</script>

<div class="py-4 text-gray-500 dark:text-gray-400">
	{#if withTitle}
		<a class="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="/">{appName}</a>
	{/if}
	<ul class="mt-6">
		{#each links as link, a}
			<li class="relative px-6 py-3">
				{#if isMainLink(link)}
					<span
						class="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
						aria-hidden="true"
					/>
				{/if}

				{#if !link.sublinks}
					<a
						class="{isMainLink(link) &&
							'text-gray-800 dark:text-gray-100'} inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
						href={link.url}
						on:click={(e) => {
							e.preventDefault()
							changeLink(link)
						}}
					>
						{#if link.svg}
							<svg
								class="w-5 h-5"
								aria-hidden="true"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{#each link.svg as s, b}
									<path d={s} />
								{/each}
							</svg>
						{/if}
						<span class="ml-4">{link.name}</span>
					</a>
				{:else}
					<button
						on:click={() => togglePageMenu(link.name)}
						class="{isChildLink(link) &&
							'text-gray-800 dark:text-gray-100'} inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
						aria-haspopup="true"
					>
						<span class="inline-flex items-center">
							<svg
								class="w-5 h-5"
								aria-hidden="true"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
								/>
							</svg>
							<span class="ml-4">{link.name}</span>
						</span>
						<svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
					{#if $pageMenus[link.name] || isChildLink(link)}
						<ul
							class="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
							aria-label="submenu"
						>
							{#each link.sublinks as sublink, c}
								<li
									class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
								>
									<a class="w-full" href={sublink.url}>{sublink.name}</a>
								</li>
							{/each}
						</ul>
					{/if}
				{/if}
			</li>
		{/each}
	</ul>
</div>
