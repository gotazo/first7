export function calculate(income, includeFuture) {
  const tithe = income * 0.10;
  const help = income * 0.05;
  const emergency = income * 0.05;
  const future = includeFuture ? income * 0.10 : 0;
  const living = income - (tithe + help + emergency + future);

  return { income, tithe, help, emergency, future, living };
}