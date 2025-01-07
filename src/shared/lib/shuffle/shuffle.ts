import { COUNT_RANDOMIZED_QUESTIONS_SETS } from "shared/const/const";

export function shuffle(length: number) {
   let array = Array.from({ length }, (_, i) => i);
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
   }
   return array;
}


export function createRandomizedQuestionsSets(countQuestions: number, countSests: number = COUNT_RANDOMIZED_QUESTIONS_SETS) {
   return Array.from({ length: countSests }, () => shuffle(countQuestions))
}

