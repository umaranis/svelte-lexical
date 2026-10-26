<!--
  Minimal single date picker, standing in for react-day-picker used by the lexical playground
  (captionLayout="dropdown", navLayout="after", showOutsideDays=false, fixedWeeks=false).
-->
<script lang="ts">
  import {untrack} from 'svelte';

  interface Props {
    selected: Date | undefined;
    onSelect: (date: Date) => void;
    startMonth: Date;
    endMonth: Date;
  }

  let {selected, onSelect, startMonth, endMonth}: Props = $props();

  const MONTHS = Array.from({length: 12}, (_, i) =>
    new Date(2000, i, 1).toLocaleString(undefined, {month: 'long'}),
  );
  const WEEKDAYS = Array.from({length: 7}, (_, i) =>
    // 2000-01-02 is a Sunday
    new Date(2000, 0, 2 + i).toLocaleString(undefined, {weekday: 'short'}),
  );

  function isValidDate(date: Date | undefined): date is Date {
    return date !== undefined && !isNaN(date.getTime());
  }

  function monthIndex(date: Date) {
    return date.getFullYear() * 12 + date.getMonth();
  }

  const initial = untrack(() =>
    isValidDate(selected) ? selected : new Date(),
  );
  let displayYear = $state(initial.getFullYear());
  let displayMonth = $state(initial.getMonth());

  let years = $derived(
    Array.from(
      {length: endMonth.getFullYear() - startMonth.getFullYear() + 1},
      (_, i) => startMonth.getFullYear() + i,
    ),
  );

  let current = $derived(displayYear * 12 + displayMonth);
  let canGoPrevious = $derived(current > monthIndex(startMonth));
  let canGoNext = $derived(current < monthIndex(endMonth));

  let weeks = $derived.by(() => {
    const firstWeekday = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const cells: Array<number | null> = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({length: daysInMonth}, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    const result: Array<Array<number | null>> = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  });

  function setDisplay(index: number) {
    displayYear = Math.floor(index / 12);
    displayMonth = index % 12;
  }

  function isSameDay(date: Date | undefined, day: number) {
    return (
      isValidDate(date) &&
      date.getFullYear() === displayYear &&
      date.getMonth() === displayMonth &&
      date.getDate() === day
    );
  }
</script>

<div class="rdp-root">
  <div class="rdp-month_caption">
    <select
      class="rdp-dropdown"
      aria-label="Choose the Month"
      value={displayMonth}
      onchange={(e) => (displayMonth = Number(e.currentTarget.value))}>
      {#each MONTHS as month, i (month)}
        <option
          value={i}
          disabled={(displayYear === startMonth.getFullYear() &&
            i < startMonth.getMonth()) ||
            (displayYear === endMonth.getFullYear() &&
              i > endMonth.getMonth())}>
          {month}
        </option>
      {/each}
    </select>
    <select
      class="rdp-dropdown"
      aria-label="Choose the Year"
      value={displayYear}
      onchange={(e) => {
        const year = Number(e.currentTarget.value);
        setDisplay(
          Math.min(
            Math.max(year * 12 + displayMonth, monthIndex(startMonth)),
            monthIndex(endMonth),
          ),
        );
      }}>
      {#each years as year (year)}
        <option value={year}>{year}</option>
      {/each}
    </select>
    <nav class="rdp-nav">
      <button
        type="button"
        class="rdp-button_previous"
        aria-label="Go to the Previous Month"
        disabled={!canGoPrevious}
        onclick={() => setDisplay(current - 1)}>
        ‹
      </button>
      <button
        type="button"
        class="rdp-button_next"
        aria-label="Go to the Next Month"
        disabled={!canGoNext}
        onclick={() => setDisplay(current + 1)}>
        ›
      </button>
    </nav>
  </div>
  <table class="rdp-month_grid" role="grid">
    <thead>
      <tr>
        {#each WEEKDAYS as weekday (weekday)}
          <th class="rdp-weekday" scope="col">{weekday}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each weeks as week, w (w)}
        <tr>
          {#each week as day, d (d)}
            <td class="rdp-day">
              {#if day !== null}
                <button
                  type="button"
                  class="rdp-day_button"
                  class:rdp-selected={isSameDay(selected, day)}
                  class:rdp-today={isSameDay(new Date(), day)}
                  aria-pressed={isSameDay(selected, day)}
                  onclick={() =>
                    onSelect(new Date(displayYear, displayMonth, day))}>
                  {day}
                </button>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .rdp-root {
    --rdp-accent-color: #76b6ff;
    --rdp-accent-background-color: #f0f0f0;
    padding: 8px 0;
  }
  .rdp-month_caption {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
  }
  .rdp-dropdown {
    font: inherit;
    font-weight: bold;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .rdp-nav {
    margin-left: auto;
    display: flex;
  }
  .rdp-nav button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    width: 28px;
    height: 28px;
    color: var(--rdp-accent-color);
  }
  .rdp-nav button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .rdp-month_grid {
    border-collapse: collapse;
  }
  .rdp-weekday {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.6;
    padding: 4px 0;
  }
  .rdp-day {
    padding: 0;
    text-align: center;
  }
  .rdp-day_button {
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    border-radius: 100%;
    background: transparent;
    cursor: pointer;
    font: inherit;
  }
  .rdp-day_button:hover {
    background: var(--rdp-accent-background-color);
  }
  .rdp-today {
    color: var(--rdp-accent-color);
  }
  .rdp-selected {
    font-weight: bold;
    border-color: var(--rdp-accent-color);
  }
</style>
