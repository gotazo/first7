const KEY = "financeData";

export function loadData() {
  const raw = localStorage.getItem(KEY);
  return raw
    ? JSON.parse(raw)
    : {
        settings: { includeFuture: false, lastIncome: 0 },
        funds: { help: 0, emergency: 0 },
        history: {}
      };
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(KEY);
}