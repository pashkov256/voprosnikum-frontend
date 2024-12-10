export interface IGroup {
    name: string,
    createdAt: string,
}
export interface IUser {
    _id: string,
    fullName: string,
    role: "teacher" | "admin" | "student",
    login: string,
    group: IGroup | null ,
    createdAt: string,
    updatedAt: string,
}

// export interface IUserRoles {
//     role:"teacher" | "admin" | "student",
// }
