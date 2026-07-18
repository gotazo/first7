import { loadSearchIndex, search } from "../client";
import { getSearchDOM, type SearchDOM } from "./dom";
import {
  getState,
  setQuery,
  setResults,
  setType,
} from "./state";
import {
  renderEmpty,
  renderLoading,
  renderResults,
} from "./render";
import type { SearchType } from "../types";

const SEARCH_TYPES = [
  "all",
  "teaching",
  "dictionary",
  "verse",
  "plan",
  "resource",
  "guide",
  "reflection",
] as const;

type SearchFilter = (typeof SEARCH_TYPES)[number];

let initialized = false;
let dom: SearchDOM;

export async function initSearch(): Promise<void> {
  if (initialized) return;

  initialized = true;

  dom = getSearchDOM();

  renderLoading(dom);

  try {
    await loadSearchIndex();
  } catch (error) {
    console.error(error);
    renderEmpty(dom, "Unable to load the search index.");
    return;
  }

  registerEvents();

  await performSearch();
}

function registerEvents(): void {
  dom.input.addEventListener("input", onInput);

  dom.filters.addEventListener("click", onFilterClick);

  dom.clearButton?.addEventListener("click", onClear);
}

async function onInput(event: Event): Promise<void> {
  const input = event.currentTarget;

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  setQuery(input.value);

  toggleClearButton();

  await performSearch();
}

async function onFilterClick(event: Event): Promise<void> {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest<HTMLElement>("[data-search-type]");

  if (!button) {
    return;
  }

  const value = button.dataset.searchType;

  if (!value || !isSearchFilter(value)) {
    return;
  }

  setType(value === "all" ? "all" : (value as SearchType));

  await performSearch();
}

async function onClear(): Promise<void> {
  dom.input.value = "";

  setQuery("");

  toggleClearButton();

  await performSearch();

  dom.input.focus();
}

async function performSearch(): Promise<void> {
  const state = getState();

  const results = await search({
    query: state.query,
    type: state.type,
  });

  setResults(results);

  renderResults(dom, results);
}

function toggleClearButton(): void {
  if (!dom.clearButton) {
    return;
  }

  const hasValue = dom.input.value.trim().length > 0;

  dom.clearButton.classList.toggle("hidden", !hasValue);
}

function isSearchFilter(value: string): value is SearchFilter {
  return SEARCH_TYPES.includes(value as SearchFilter);
}