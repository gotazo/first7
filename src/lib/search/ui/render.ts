import type { SearchItem } from "../types";
import type { SearchDOM } from "./dom";

import { groupResults } from "../utils/group";

import {
  clearResults,
  renderEmpty,
} from "./render-empty";

import { renderGroup } from "./render-group";

/**
 * Render grouped search results.
 *
 * Responsibilities:
 *  - Clear previous results
 *  - Handle empty state
 *  - Group results
 *  - Render each section
 *
 * Rendering details are delegated to dedicated modules.
 */
export function renderResults(
  dom: SearchDOM,
  items: SearchItem[]
): void {
  clearResults(dom);

  if (items.length === 0) {
    renderEmpty(dom);
    return;
  }

  const groups = groupResults(items);

  const fragment = document.createDocumentFragment();

  for (const group of groups) {
    fragment.appendChild(renderGroup(group));
  }

  dom.results.replaceChildren(fragment);
}

export {
  clearResults,
  renderEmpty,
  renderLoading,
} from "./render-empty";