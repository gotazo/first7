import type { SearchDOM } from "./dom";

/**
 * Remove every rendered result.
 */
export function clearResults(dom: SearchDOM): void {
  dom.results.replaceChildren();

  hide(dom.loading);
  hide(dom.emptyState);
}

/**
 * Display loading UI.
 */
export function renderLoading(dom: SearchDOM): void {
  clearResults(dom);

  if (dom.loading) {
    show(dom.loading);
    return;
  }

  const loading = document.createElement("div");

  loading.className =
    "py-12 text-center text-[var(--color-muted)]";

  loading.textContent = "Loading search…";

  dom.results.appendChild(loading);
}

/**
 * Display empty state.
 */
export function renderEmpty(
  dom: SearchDOM,
  message = "No results found."
): void {
  clearResults(dom);

  if (dom.emptyState) {
    dom.emptyState.textContent = message;

    show(dom.emptyState);

    return;
  }

  const empty = document.createElement("div");

  empty.className =
    "py-12 text-center text-[var(--color-muted)]";

  empty.textContent = message;

  dom.results.appendChild(empty);
}

/**
 * Show element.
 */
function show(element: HTMLElement): void {
  element.classList.remove("hidden");
}

/**
 * Hide element.
 */
function hide(element: HTMLElement | null): void {
  element?.classList.add("hidden");
}