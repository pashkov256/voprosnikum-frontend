function calculateCheatingProbability(focusLossCount: number, totalQuestions: number) {
   if (totalQuestions === 0) return 0;
   const probability = focusLossCount * 1.2 / totalQuestions;//умножить 1.2 для баланса формулы
   return Math.min(1, probability);
}

