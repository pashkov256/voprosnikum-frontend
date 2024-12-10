export interface ITestResult {
    _id: string; // ID результата теста
    test: string; // ID теста
    student: string; // ID студента
    score: number; // Балл, который получил студент
    createdAt?: string;
    updatedAt?: string;
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
}

