export interface ITestResult {
    _id: string; // ID результата теста
    test: string; // ID теста
    student: string; // ID студента
    score: number; // Балл, который получил студент
    createdAt?: string;
    updatedAt?: string;
}

export interface IQuestion {
    test: string;
    title: string;
    type: 'short-answer' | 'multiple-choice';
    options?: string[];
    correctAnswers: string[];
    imageUrl?: string | null;
    timeLimit?: number;
}

export interface ITest {
    _id: string;
    name: string;
    description?: string;
    teacher: string;
    group: string; //id
    deadline: string;
    createdAt?: string;
    updatedAt?: string;
    questions?:IQuestion[];
}

