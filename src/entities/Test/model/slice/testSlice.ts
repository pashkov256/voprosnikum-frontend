import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {IQuestion, ITest} from '../types/test'
import {SERVER_URL} from "shared/const/const";
import {IUser} from "entities/User";

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
            query: (id) => ({
                url:`/test/${id}`,
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
                url:"/question/test/:id",
                method:"POST",
                body:{ test, title, type, options, correctAnswers, imageUrl, timeLimit },
            }),
        }),
    }),
});


export const { useGetTestsByTeacherQuery ,useGetTeachersQuery,useCreateUserByAdminMutation,useLazyGetTestByIdQuery,useCreateQuestionMutation} = testApi
