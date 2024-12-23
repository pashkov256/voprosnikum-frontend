import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {SERVER_URL} from "shared/const/const";
import {IUser} from "entities/User";
import {IGroup} from "entities/Group/model/types/group";

export interface ITeacherAndTests {
        fullName:string,
        tests:{
            createdAt:string,
            deadline:string,
            name:string,
            teacher:string,
            testIsComplete:boolean,
            questions:string[],
            timeLimit:number,
            _id:string,
        }[],
        _id:string,
    }


export interface ITeachersAndTests {
    groupName:string,
    teachers:ITeacherAndTests[]
}

export const userApi = createApi({
    reducerPath: 'userApi',
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
        getTeachersMinimal: builder.query<{_id:string,fullName:string}[], void>({
            query: () => ({
                url:`/teachers/minimal`,
                method:"GET",
            }),
        }),
        getTeacherAndTests: builder.query<ITeachersAndTests,void>({
            query: () => ({
                url:`/groups/teachers-tests`,
                method:"GET",
            }),
        }),
    }),
});


export const {useGetTeachersMinimalQuery,useGetTeacherAndTestsQuery} = userApi
