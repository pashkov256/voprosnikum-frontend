import {ITest} from "entities/Test";

export interface ICleanedTest {
    name: string;
    description?: string;
    timeLimit: number;
    maxPoints: number;
    questions: ICleanedQuestion[];
    countRandomizedQuestionsSets: number;
    randomizedQuestionsSets: number[][];
    isResultVisibleAfterDeadline: boolean;
    isQuestionsRandomized: boolean;
}

interface ICleanedQuestion {
    title: string;
    type: string;
    options: string[];
    correctAnswers: string[];
    imageUrl?: string | null;
    shortAnswer?: string;
    timeLimit?: number;
}

export const cleanedTestFormData = (testFormData:ITest):ICleanedTest => {
    // Создаем копию объекта, чтобы не изменять оригинальный
    const cleanedData = { ...testFormData };

    // Удаляем ненужные поля из основного объекта
    const fieldsToRemove = ['_id', 'teacher', 'startDate', 'deadline', 'group', 'createdAt', '__v'];
    //@ts-ignore
    fieldsToRemove.forEach(field => delete cleanedData[field]);

    // Удаляем поле _id из каждого вопроса в массиве questions
    if (cleanedData.questions && Array.isArray(cleanedData.questions)) {
        //@ts-ignore
        cleanedData.questions = cleanedData.questions.map(question => {
            const { _id, ...rest } = question; // Удаляем _id из каждого вопроса
            return {...rest,isNewQuestion:true};
        });
    }
    console.log({cleanedData})
//@ts-ignore
    return cleanedData;
};
