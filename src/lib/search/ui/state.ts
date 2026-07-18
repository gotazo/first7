import type { SearchItem, SearchType } from "../types";

export interface SearchState {
  query: string;
  type: SearchType | "all";
  results: SearchItem[];
}

const state: SearchState = {
  query: "",
  type: "all",
  results: [],
};

export function getState(): SearchState {
  return state;
}

export function setQuery(query: string): void {
  state.query = query;
}

export function setType(type: SearchType | "all"): void {
  state.type = type;
}

export function setResults(results: SearchItem[]): void {
  state.results = results;
}

export function resetState(): void {
  state.query = "";
  state.type = "all";
  state.results = [];
}