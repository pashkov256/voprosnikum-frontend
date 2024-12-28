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
        getTestsByTeacher: builder.query<ITest[], {teacherId:string,sortGroupBy:string}>({
            query: ({teacherId,sortGroupBy}) =>
            ({
                url:`/tests/teacher/${teacherId}`,
                method:"POST",
                body:{sortGroupBy}
            })
            ,
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
            query: ({ test, title, title1, type, options, correctAnswers, imageUrl, timeLimit }) => ({
                url:`/question/test/${test}`,
                method:"POST",
                body:{ test, title, type, options, correctAnswers, imageUrl, timeLimit , title1},
            }),
        }),
        createTest: builder.mutation<ITest, {teacher:string}>({
            query: ({teacher}) => ({
                url:"/tests",
                method:"POST",
                body:{ teacher,name:"Название нового теста" },
            }),
        }),
        updateTest: builder.mutation<ITest, ITest>({
            query: ({name,description,teacher,questions,_id,createdAt,deadline,timeLimit,group,isResultVisibleAfterDeadline}) => ({
                url:`/tests/${_id}`,
                method:"PUT",
                body:{name,description,teacher,questions,_id,createdAt,deadline,timeLimit,group,isResultVisibleAfterDeadline},
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
        getTestAllResults: builder.query<ITestResult[], string>({
            query: (_id) => ({
                url:`/test/${_id}/results`,
                method:"GET",
            }),
        }),
        createTestAnswer: builder.mutation<void , { testResult:string, question:string,isCorrect?:boolean,selectedAnswerOptions?:string[],correctAnswers?:string,isTimeFail?:boolean}>({
            query: ({ testResult, question,isCorrect,selectedAnswerOptions,correctAnswers,isTimeFail}) => ({
                url:`/test/create-answer`,
                method:"POST",
                body:{ testResult, question,isCorrect,selectedAnswerOptions,correctAnswers,isTimeFail}
            }),
        }),
        updateTestResult: builder.mutation<void , { completedAt?:string, dateStart?:string,completionTime?:string,id:string}>({
            query: ({ completedAt, dateStart,completionTime,id}) => ({
                url:`/results/${id}`,
                method:"PUT",
                body:{ completedAt, dateStart,completionTime}
            }),
        }),
        deleteTest: builder.mutation<void , string>({
            query: (id) => ({
                url:`/tests/${id}`,
                method:"DELETE",
            }),
        }),
    }),
});


export const { useGetTestsByTeacherQuery ,useGetTeachersQuery,useCreateUserByAdminMutation,useLazyGetTestByIdQuery,useCreateQuestionMutation,useCreateTestMutation,useGetTestByIdQuery,useUpdateTestMutation,useCreateTestResultMutation,useGetTestResultQuery,useCreateTestAnswerMutation,useGetTestAllResultsQuery,useUpdateTestResultMutation,useDeleteTestMutation} = testApi
