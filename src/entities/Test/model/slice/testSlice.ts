import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from "entities/User";
import { IAnswer } from "model/IQuiz";
import { SERVER_URL } from "shared/const/const";
import { IQuestion, ITest, ITestAnswer, ITestResult, ITestResultDetails, ITestWithPopulate } from '../types/test';

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
        getAdmins: builder.query<IUser, void>({
            query: () => `/user/admins`,
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
            query: ({ test, title, type, options, correctAnswers, imageUrl, timeLimit }) => ({
                url: `/question/test/${test}`,
                method: "POST",
                body: { test, title, type, options, correctAnswers, imageUrl, timeLimit },
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
            query: ({ name, description, teacher, questions, _id, createdAt, deadline, timeLimit, group, isResultVisibleAfterDeadline, randomizedQuestionsSets, isQuestionsRandomized, countRandomizedQuestionsSets,startDate }) => ({
                url: `/tests/${_id}`,
                method: "PUT",
                body: { name, description, teacher, questions, _id, createdAt, deadline, timeLimit, group, isResultVisibleAfterDeadline, randomizedQuestionsSets, isQuestionsRandomized, countRandomizedQuestionsSets,startDate },
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
        deleteTestResult: builder.query<ITestResult, string>({
            query: ( testResultId ) => ({
                url: `/results/${testResultId}`,
                method: "DELETE",
            }),
        }),
        getTestAllResults: builder.query<ITestResultDetails[], string>({
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
        updateTestAnswer: builder.mutation<void, { testResult: string, shortAnswer?: string, selectedOptions?: string[], testAnswerId: string, pointsAwarded: number }>({
            query: ({ testResult, selectedOptions, shortAnswer, testAnswerId, pointsAwarded }) => ({
                url: `/test/update-answer`,
                method: "PUT",
                body: { testResult, selectedOptions, shortAnswer, testAnswerId, pointsAwardedOld: pointsAwarded }
            }),
        }),
        updateTestResult: builder.mutation<void, { completedAt?: string, dateStart?: string, completionTime?: string, id: string, focusLossCount?: number }>({
            query: ({ completedAt, dateStart, completionTime, id, focusLossCount }) => ({
                url: `/results/${id}`,
                method: "PUT",
                body: { completedAt, dateStart, completionTime, focusLossCount }
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


export const { useGetTestsByTeacherQuery, useGetTeachersQuery, useCreateUserByAdminMutation, useLazyGetTestByIdQuery, useCreateQuestionMutation, useCreateTestMutation, useGetTestByIdQuery, useUpdateTestMutation, useCreateTestResultMutation, useGetTestResultQuery, useCreateTestAnswerMutation, useGetTestAllResultsQuery, useUpdateTestResultMutation, useDeleteTestMutation, useUpdateTestAnswerMutation ,useLazyDeleteTestResultQuery,useGetAdminsQuery} = testApi
