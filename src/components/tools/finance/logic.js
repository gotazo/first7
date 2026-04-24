export function calculate(income, includeFuture) {
  const church = income * 0.10;
  const help = income * 0.05;
  const emergency = income * 0.05;
  const future = includeFuture ? income * 0.10 : 0;
  const living = income - (church + help + emergency + future);

  return { income, church, help, emergency, future, living };
}