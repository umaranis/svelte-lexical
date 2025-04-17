<script lang="ts">
  import {CAN_USE_DOM} from '@lexical/utils';
  import {onMount, onDestroy} from 'svelte';
  import {themeTracker, type ThemeMode} from './themeTracker.svelte.js';

  let showDropdown = $state(false);

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const selector = document.querySelector('.theme-selector');
    if (showDropdown && selector && !event.composedPath().includes(selector)) {
      showDropdown = false;
    }
  }

  // Add and remove event listener
  onMount(() => {
    if (CAN_USE_DOM === false) return;
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    if (CAN_USE_DOM === false) return;
    document.removeEventListener('click', handleClickOutside);
  });

  function changeMode(mode: ThemeMode) {
    themeTracker.mode = mode;
    showDropdown = false;
  }
</script>

<svelte:head>
  <script>
    const themeMode = localStorage.getItem('app-theme');
    let themeColor;
    if (!themeMode || themeMode === 'system') {
      themeColor = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      themeColor = themeMode;
    }

    document.querySelector('html')?.setAttribute('data-theme', themeColor);
  </script>
</svelte:head>

{#snippet systemIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-monitor-icon lucide-monitor">
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
{/snippet}

{#snippet lightIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
{/snippet}

{#snippet darkIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
{/snippet}

<div class="theme-selector">
  <button
    onclick={toggleDropdown}
    aria-label="Toggle theme menu"
    title="Change theme"
    class="theme-button">
    {#if themeTracker.mode === 'system'}
      <!-- System theme icon -->
      {@render systemIcon()}
    {:else if themeTracker.mode === 'light'}
      <!-- Light theme icon -->
      {@render lightIcon()}
    {:else}
      <!-- Dark theme icon -->
      {@render darkIcon()}
    {/if}
  </button>

  {#if showDropdown}
    <div class="theme-dropdown">
      <button
        class="theme-option {themeTracker.mode === 'system' ? 'active' : ''}"
        onclick={() => changeMode('system')}>
        {@render systemIcon()}
        <span>System</span>
      </button>

      <button
        class="theme-option {themeTracker.mode === 'light' ? 'active' : ''}"
        onclick={() => changeMode('light')}>
        {@render lightIcon()}
        <span>Light</span>
      </button>

      <button
        class="theme-option {themeTracker.mode === 'dark' ? 'active' : ''}"
        onclick={() => changeMode('dark')}>
        {@render darkIcon()}
        <span>Dark</span>
      </button>
    </div>
  {/if}
</div>

<style>
  .theme-selector {
    display: inline-flex;
    align-items: center;
    position: relative;
  }

  .theme-button {
    background: var(--button-background, #eee);
    border: none;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color, #000);
    transition: background-color 0.2s;
  }

  .theme-button:hover {
    background: var(--button-hover-background, #ddd);
  }

  .theme-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: var(--dropdown-background, #fff);
    border-radius: 4px;
    box-shadow: 0 2px 10px var(--dropdown-shadow, rgba(0, 0, 0, 0.1));
    padding: 4px;
    z-index: 100;
    min-width: 120px;
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px;
    border: none;
    background: transparent;
    color: var(--text-color, #000);
    cursor: pointer;
    border-radius: 4px;
    text-align: left;
  }

  .theme-option:hover {
    background: var(--dropdown-hover, #eee);
  }

  .theme-option.active {
    background: var(--active-background, rgba(223, 232, 250, 0.3));
    color: var(--active-control, rgb(60, 132, 244));
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
</style>
