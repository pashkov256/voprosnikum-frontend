import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ITest } from '../types/test'
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
        createUserByAdmin: builder.mutation<IUser, {fullName:string,role:"teacher" | "admin" | "student"}>({
            query: ({fullName,role}) => ({
                url:"/user/createByAdmin",
                method:"POST",
                body:{fullName,role},
            }),
        }),
    }),
});


export const { useGetTestsByTeacherQuery ,useGetTeachersQuery,useCreateUserByAdminMutation} = testApi
