import type { SearchGroup } from "../utils/group";
import { renderCard } from "./render-card";

/**
 * Maximum number of cards initially displayed
 * in each library section.
 */
const INITIAL_VISIBLE_COUNT = 5;

/**
 * Render one grouped search section.
 *
 * Example:
 *
 * Teachings (18)
 * ──────────────
 * □ □ □
 * □ □
 * Show all 18
 */
export function renderGroup(group: SearchGroup): HTMLElement {
  const section = document.createElement("section");

  section.className = "space-y-6";

  //--------------------------------------------------
  // Header
  //--------------------------------------------------

  const header = document.createElement("div");

  header.className =
    "flex items-center justify-between gap-4";

  const heading = document.createElement("h2");

  heading.className =
    "text-2xl font-semibold tracking-tight";

  heading.textContent =
    `${group.title} (${group.items.length})`;

  header.appendChild(heading);

  section.appendChild(header);

  //--------------------------------------------------
  // Grid
  //--------------------------------------------------

  const grid = document.createElement("div");

  grid.className = [
    "grid",
    "grid-cols-1",
    "gap-6",
    "md:grid-cols-2",
    "xl:grid-cols-3",
  ].join(" ");

  section.appendChild(grid);

  //--------------------------------------------------
  // Render first five cards
  //--------------------------------------------------

  let expanded = false;

  const renderCards = () => {
    grid.replaceChildren();

    const visibleItems = expanded
      ? group.items
      : group.items.slice(0, INITIAL_VISIBLE_COUNT);

    for (const item of visibleItems) {
      grid.appendChild(renderCard(item));
    }

    updateButton();
  };

  //--------------------------------------------------
  // Expand / Collapse Button
  //--------------------------------------------------

  const button = document.createElement("button");

  button.type = "button";

  button.className = [
    "text-sm",
    "font-medium",
    "transition-colors",
    "text-[var(--color-primary)]",
    "hover:underline",
  ].join(" ");

  button.addEventListener("click", () => {
    expanded = !expanded;

    renderCards();
  });

  function updateButton(): void {
    if (group.items.length <= INITIAL_VISIBLE_COUNT) {
      button.remove();
      return;
    }

    button.textContent = expanded
      ? "Show less"
      : `Show all ${group.items.length}`;

    if (!button.parentElement) {
      section.appendChild(button);
    }
  }

  //--------------------------------------------------
  // Initial render
  //--------------------------------------------------

  renderCards();

  return section;
}