
export interface IQuestion {
    test: string;
    title: string | null;
    title1?: string | null;
    type: 'short-answer' | 'multiple-choice' | 'single-choice';
    options: string[];
    correctAnswers: string[];
    imageUrl?: string | null;
    timeLimit?: number;
    _id?:string;
}

export interface ITest {
    _id: string;
    name: string;
    description?: string;
    teacher: string | {fullName:string};
    group: string; //id
    deadline?: string;
    createdAt?: string;
    updatedAt?: string;
    timeLimit: number;
    questions:IQuestion[];
    haveTestResult?:boolean;
    isResultVisibleAfterDeadline:boolean;
}

export interface  ITestAnswer{
    question:string,
    content:string[],
    isCorrect:boolean,
}

export interface ITestResult{
    test:string;
    student:string;
    testAnswers?:ITestAnswer[];
    completedAt?:string;
    dateStart?:string;
    completionTime?:string;
    score?:number;
    points: number;
    _id:string;
}

export interface ITestNoPopulate {
    _id: string;
    name: string;
    description?: string;
    teacher: string;
    group: string; //id
    deadline: string;
    createdAt?: string;
    updatedAt?: string;
    questions:string[];
}

