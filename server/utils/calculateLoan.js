export function calculateLoan(amount, durationWeeks, rate = 0.05) {
  amount = Number(amount);
  durationWeeks = Number(durationWeeks);

  const periods = durationWeeks / 4;

  const interest = amount * rate * periods;
  const totalRepayment = amount + interest;

  return { interest, totalRepayment };
}