export interface IQuestion {
    _id: string;
    test: string;
    title: string | null;
    // title1?: string | null;
    type: 'short-answer' | 'multiple-choice' | 'single-choice';
    options: string[];
    correctAnswers: string[];
    shortAnswer: string;
    selectedOptions: string[];
    imageUrl?: string | null;
    timeLimit?: number;
    isNewQuestion?: boolean;
    shortAnswerPoints: number;
    multipleChoicePoints: number;
    singleChoicePoints: number;
}

export interface ITest {
    _id: string;
    name: string;
    description?: string;
    teacher: string | { fullName: string };
    group: string; //id
    deadline?: string;
    startDate?: string;
    createdAt?: string;
    updatedAt?: string;
    timeLimit: number;
    maxPoints: number;
    questions: IQuestion[];
    countRandomizedQuestionsSets: number;
    randomizedQuestionsSets: number[][];
    isResultVisibleAfterDeadline: boolean;
    isQuestionsRandomized: boolean;
}

export interface ITestAnswer {
    _id: string;
    question: string,
    pointsAwarded: number,
    shortAnswer: string,
    selectedOptions: string[],
    isTimeFail: boolean,
    isCorrect: boolean,
}
export interface ITestAnswer {
    _id: string;
    question: string,
    pointsAwarded: number,
    shortAnswer: string,
    selectedOptions: string[],
    isTimeFail: boolean,
    isCorrect: boolean,
}

export interface ITestResult {
    test: string;
    student: {
        fullName: string,
        _id: string,
    };
    testAnswers: ITestAnswer[];
    completedAt?: string;
    dateStart?: string;
    completionTime?: string;
    score?: number;
    points: number;
    randomizedQuestionsSetIndex: number;
    focusLossCount: number;
    _id: string;
}

export type TestAnswersDetails = Omit<ITestAnswer, 'question'> & {
    question: {
        correctAnswers: string[];
        shortAnswer: string;
        title: string;
        type: 'short-answer' | 'multiple-choice' | 'single-choice';
        _id: string;
    };
    __v: number;
};

export interface ITestResultDetails {
    test: string;
    student: {
        fullName: string,
        _id: string,
    };
    testAnswers: TestAnswersDetails[];
    completedAt?: string;
    dateStart?: string;
    completionTime?: string;
    score?: number;
    points: number;
    randomizedQuestionsSetIndex: number;
    focusLossCount: number;
    _id: string;
}

export interface ITestWithPopulate extends Omit<ITest, 'teacher'> {
    teacher: {
        fullName: string
    }
}
