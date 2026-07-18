import type { SearchItem } from "../types";

/**
 * Render a search result card.
 *
 * This is the only public function exported by this module.
 * Future card types can have their own specialized renderer
 * without changing the rest of the UI.
 */
export function renderCard(item: SearchItem): HTMLElement {
  switch (item.type) {
    case "teaching":
    case "dictionary":
    case "verse":
    case "plan":
    case "guide":
    case "resource":
    case "reflection":
    case "bible":
      return renderDefaultCard(item);

    default:
      return renderDefaultCard(item);
  }
}

/**
 * Default renderer shared by all content types.
 */
function renderDefaultCard(item: SearchItem): HTMLElement {
  const article = document.createElement("article");

  article.className = [
    "rounded-2xl",
    "border",
    "border-[var(--color-border)]",
    "bg-[var(--color-bg-soft)]",
    "p-6",
    "transition-all",
    "duration-200",
    "hover:-translate-y-0.5",
    "hover:border-[var(--color-primary)]",
    "hover:shadow-md",
  ].join(" ");

  article.appendChild(renderBadge(item.type));

  const heading = document.createElement("h2");

  heading.className =
    "mt-3 text-xl font-semibold leading-snug";

  const link = document.createElement("a");

  link.href = item.url;

  link.className = [
    "transition-colors",
    "hover:text-[var(--color-primary)]",
    "focus:outline-none",
    "focus:text-[var(--color-primary)]",
  ].join(" ");

  link.textContent = item.title;

  heading.appendChild(link);

  article.appendChild(heading);

  if (item.description) {
    const description = document.createElement("p");

    description.className =
      "mt-3 text-sm leading-6 text-[var(--color-muted)]";

    description.textContent = item.description;

    article.appendChild(description);
  }

  return article;
}

/**
 * Small badge displayed above every card.
 */
function renderBadge(type: SearchItem["type"]): HTMLElement {
  const badge = document.createElement("span");

  badge.className = [
    "inline-flex",
    "items-center",
    "rounded-full",
    "border",
    "border-[var(--color-border)]",
    "px-3",
    "py-1",
    "text-xs",
    "font-semibold",
    "uppercase",
    "tracking-wide",
  ].join(" ");

  badge.textContent = formatType(type);

  return badge;
}

/**
 * Human readable labels.
 */
function formatType(type: SearchItem["type"]): string {
  switch (type) {
    case "teaching":
      return "Teaching";

    case "dictionary":
      return "Dictionary";

    case "verse":
      return "Verse Jar";

    case "plan":
      return "Plan";

    case "guide":
      return "Guide";

    case "resource":
      return "Resource";

    case "reflection":
      return "Reflection";

    case "bible":
      return "Bible";

    default:
      return "Content";
  }
}