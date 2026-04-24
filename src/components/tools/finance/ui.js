export function setText(id, value) {
  document.getElementById(id).innerText = Math.round(value || 0);
}

export function updateBreakdown(data) {
  setText("church", data.church);
  setText("help", data.help);
  setText("emergency", data.emergency);
  setText("future", data.future);
  setText("living", data.living);
}

export function updateFunds(funds) {
  setText("helpFund", funds.help);
  setText("emergencyFund", funds.emergency);
}