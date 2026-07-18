export interface SearchDOM {
  // Core UI
  input: HTMLInputElement;
  results: HTMLElement;
  filters: HTMLElement;

  // Optional UI (may not exist yet)
  form: HTMLFormElement | null;
  clearButton: HTMLButtonElement | null;
  loading: HTMLElement | null;
  emptyState: HTMLElement | null;
}

export function getSearchDOM(): SearchDOM {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  const filters = document.getElementById("search-filters");

  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Missing #search-input');
  }

  if (!(results instanceof HTMLElement)) {
    throw new Error('Missing #search-results');
  }

  if (!(filters instanceof HTMLElement)) {
    throw new Error('Missing #search-filters');
  }

  return {
    input,
    results,
    filters,

    form: document.getElementById("search-form") as HTMLFormElement | null,

    clearButton: document.getElementById(
      "search-clear"
    ) as HTMLButtonElement | null,

    loading: document.getElementById("search-loading"),

    emptyState: document.getElementById("search-empty"),
  };
}