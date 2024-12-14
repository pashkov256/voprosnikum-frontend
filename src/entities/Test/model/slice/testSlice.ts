import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {IQuestion, ITest, ITestAnswer, ITestNoPopulate, ITestResult} from '../types/test'
import {SERVER_URL} from "shared/const/const";
import {IUser} from "entities/User";
import {IAnswer} from "model/IQuiz";

export const testApi = createApi({
    reducerPath: 'testApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVER_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getTestsByTeacher: builder.query<ITest, string>({
            query: (teacherId: string) => `/tests/teacher/${teacherId}`,
        }),
        getTeachers: builder.query<IUser, void>({
            query: () => `/user/teachers`,
        }),
        getTestById: builder.query<ITest,{_id:string}>({
            query: ({_id}) => ({
                url:`/tests/${_id}`,
                method:"GET",
            }),
        }),

        createUserByAdmin: builder.mutation<IUser, {fullName:string,role:"teacher" | "admin" | "student",group?:string}>({
            query: ({fullName,role,group}) => ({
                url:"/user/createByAdmin",
                method:"POST",
                body:{fullName,role,group},
            }),
        }),
        createQuestion: builder.mutation<IQuestion, IQuestion>({
            query: ({ test, title, type, options, correctAnswers, imageUrl, timeLimit }) => ({
                url:`/question/test/${test}`,
                method:"POST",
                body:{ test, title, type, options, correctAnswers, imageUrl, timeLimit },
            }),
        }),
        createTest: builder.mutation<ITest, {teacher:string}>({
            query: ({teacher}) => ({
                url:"/tests",
                method:"POST",
                body:{ teacher,name:"Новый тест" },
            }),
        }),
        updateTest: builder.mutation<ITest, ITest>({
            query: ({name,description,teacher,questions,_id,createdAt,deadline,timeLimit,group}) => ({
                url:`/tests/${_id}`,
                method:"PUT",
                body:{name,description,teacher,questions,_id,createdAt,deadline,timeLimit,group},
            }),
        }),
        createTestResult: builder.mutation<ITestResult, ITestResult>({
            query: ({ test, student, dateStart}) => ({
                url:`/test/${test}/create-result`,
                method:"POST",
                body:{ test, student, dateStart},
            }),
        }),
        getTestResult: builder.query<ITestResult, ITestResult>({
            query: ({ test, student}) => ({
                url:`/test/${test}/student/${student}`,
                method:"GET",
            }),
        }),
        getTestAllResults: builder.query<ITestResult, ITestResult>({
            query: ({ test}) => ({
                url:`/test/${test}/results`,
                method:"GET",
            }),
        }),
        createTestAnswer: builder.mutation<void , { testResult:string, question:string,isCorrect:boolean}>({
            query: ({ testResult, question,isCorrect}) => ({
                url:`/test/create-answer`,
                method:"POST",
                body:{ testResult, question,isCorrect}
            }),
        }),
    }),
});


export const { useGetTestsByTeacherQuery ,useGetTeachersQuery,useCreateUserByAdminMutation,useLazyGetTestByIdQuery,useCreateQuestionMutation,useCreateTestMutation,useGetTestByIdQuery,useUpdateTestMutation,useCreateTestResultMutation,useGetTestResultQuery,useCreateTestAnswerMutation,useGetTestAllResultsQuery} = testApi
