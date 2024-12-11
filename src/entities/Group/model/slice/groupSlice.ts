import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {SERVER_URL} from "shared/const/const";
import {IUser} from "entities/User";
import {IGroup} from "entities/Group/model/types/group";

export const groupApi = createApi({
    reducerPath: 'groupApi',
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
        getGroups: builder.query<IGroup[], void>({
            query: () =>({
                url:"/groups",
                method:"GET",
            }),
        }),
        createGroup: builder.mutation<IGroup[],string>({
            query: (name) =>({
                url:"/groups",
                method:"POST",
                body:{
                    name:name
                }
            }),
        }),
        addTeacherToGroup: builder.mutation<void,{
            groupId:string,
            teacherId:string,
        }>({
            query: ({groupId,teacherId}) =>({
                url:"/group/add-teacher",
                method:"POST",
                body:{
                    groupId,teacherId
                }
            }),
        }),
        removeTeacherFromGroup: builder.mutation<void,{
            groupId:string,
            teacherId:string,
        }>({
            query: ({groupId,teacherId}) =>({
                url:"/group/delete-teacher",
                method:"DELETE",
                body:{
                    groupId,teacherId
                }
            }),
        }),
        getStudentsByGroup: builder.query<IGroup, string>({
            query: (groupId) => ({
                url:`/groups/${groupId}/users`,
                method:"GET",
            }),
        }),
        getGroupById: builder.query<IGroup, string>({
            query: (groupId) => ({
                url:`/group/${groupId}`,
                method:"GET",
            }),
        }),
        getTeachers: builder.query<IGroup, string>({
            query: (groupId) => ({
                url:`/group/${groupId}`,
                method:"GET",
            }),
        }),
    }),
});


export const { useGetGroupsQuery,useCreateGroupMutation ,useGetStudentsByGroupQuery,useGetGroupByIdQuery,useAddTeacherToGroupMutation,useRemoveTeacherFromGroupMutation} = groupApi
