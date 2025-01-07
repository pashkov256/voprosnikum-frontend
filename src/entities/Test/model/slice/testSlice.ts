import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from "entities/User";
import { IAnswer } from "model/IQuiz";
import { SERVER_URL } from "shared/const/const";
import { IQuestion, ITest, ITestAnswer, ITestResult, ITestWithPopulate } from '../types/test';

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
        getTestsByTeacher: builder.query<ITest[], { teacherId: string, sortGroupBy: string }>({
            query: ({ teacherId, sortGroupBy }) =>
            ({
                url: `/tests/teacher/${teacherId}`,
                method: "POST",
                body: { sortGroupBy }
            })
            ,
        }),
        getTeachers: builder.query<IUser, void>({
            query: () => `/user/teachers`,
        }),
        getTestById: builder.query<ITestWithPopulate, { _id: string, mode: "student" | "full" }>({
            query: ({ _id, mode }) => ({
                url: `/tests/${_id}/${mode}`,
                method: "GET",
            }),
        }),

        createUserByAdmin: builder.mutation<IUser, { fullName: string, role: "teacher" | "admin" | "student", group?: string }>({
            query: ({ fullName, role, group }) => ({
                url: "/user/createByAdmin",
                method: "POST",
                body: { fullName, role, group },
            }),
        }),
        createQuestion: builder.mutation<IQuestion, IQuestion>({
            query: ({ test, title, title1, type, options, correctAnswers, imageUrl, timeLimit }) => ({
                url: `/question/test/${test}`,
                method: "POST",
                body: { test, title, type, options, correctAnswers, imageUrl, timeLimit, title1 },
            }),
        }),
        createTest: builder.mutation<ITest, { teacher: string }>({
            query: ({ teacher }) => ({
                url: "/tests",
                method: "POST",
                body: { teacher, name: "Название нового теста" },
            }),
        }),
        updateTest: builder.mutation<ITest, ITest>({
            query: ({ name, description, teacher, questions, _id, createdAt, deadline, timeLimit, group, isResultVisibleAfterDeadline, randomizedQuestionsSets, isQuestionsRandomized, countRandomizedQuestionsSets }) => ({
                url: `/tests/${_id}`,
                method: "PUT",
                body: { name, description, teacher, questions, _id, createdAt, deadline, timeLimit, group, isResultVisibleAfterDeadline, randomizedQuestionsSets, isQuestionsRandomized, countRandomizedQuestionsSets },
            }),
        }),
        createTestResult: builder.mutation<ITestResult, ITestResult>({
            query: ({ test, student, dateStart, randomizedQuestionsSetIndex }) => ({
                url: `/test/${test}/create-result`,
                method: "POST",
                body: { test, student, dateStart, randomizedQuestionsSetIndex },
            }),
        }),
        getTestResult: builder.query<ITestResult, { test: string, student: string }>({
            query: ({ test, student }) => ({
                url: `/test/${test}/student/${student}`,
                method: "GET",
            }),
        }),
        getTestAllResults: builder.query<ITestResult[], string>({
            query: (_id) => ({
                url: `/test/${_id}/results`,
                method: "GET",
            }),
        }),
        createTestAnswer: builder.mutation<void, { testResult: string, shortAnswer?: string, question: string, isCorrect?: boolean, selectedOptions?: string[], correctAnswers?: string[], isTimeFail?: boolean, questionType: IQuestion['type'] }>({
            query: ({ testResult, question, isCorrect, selectedOptions, correctAnswers, isTimeFail, questionType, shortAnswer }) => ({
                url: `/test/create-answer`,
                method: "POST",
                body: { testResult, question, isCorrect, selectedOptions, correctAnswers, isTimeFail, questionType, shortAnswer }
            }),
        }),
        updateTestResult: builder.mutation<void, { completedAt?: string, dateStart?: string, completionTime?: string, id: string }>({
            query: ({ completedAt, dateStart, completionTime, id }) => ({
                url: `/results/${id}`,
                method: "PUT",
                body: { completedAt, dateStart, completionTime }
            }),
        }),
        deleteTest: builder.mutation<void, string>({
            query: (id) => ({
                url: `/tests/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});


export const { useGetTestsByTeacherQuery, useGetTeachersQuery, useCreateUserByAdminMutation, useLazyGetTestByIdQuery, useCreateQuestionMutation, useCreateTestMutation, useGetTestByIdQuery, useUpdateTestMutation, useCreateTestResultMutation, useGetTestResultQuery, useCreateTestAnswerMutation, useGetTestAllResultsQuery, useUpdateTestResultMutation, useDeleteTestMutation } = testApi
