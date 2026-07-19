import { SEARCH_SUGGESTIONS } from "./SearchSuggestions";

export function initSearchPlaceholder(input: HTMLInputElement) {
  let index = 0;
  let timer: number | undefined;

  function update() {
    input.placeholder = `Search "${SEARCH_SUGGESTIONS[index]}"...`;

    index = (index + 1) % SEARCH_SUGGESTIONS.length;
  }

  function start() {
    if (timer) return;

    update();

    timer = window.setInterval(update, 3000);
  }

  function stop() {
    if (!timer) return;

    clearInterval(timer);

    timer = undefined;
  }

  input.addEventListener("focus", stop);

  input.addEventListener("blur", start);

  start();
}