import {useCreateUserByAdminMutation, useGetTeachersQuery} from "entities/Test/model/slice/testSlice";
import {TableUsers} from "../TableUsers/TableUsers";

interface TableTeachersProps {
}
const columns = [
    { header: 'ФИО', accessor: 'fullName' },
    { header: 'Логин', accessor: 'login' },
    { header: 'Пароль', accessor: 'plainPassword' },
];
export const TableTeachers = (props: TableTeachersProps) => {
    const {data,isLoading,error,refetch} = useGetTeachersQuery()
    const [createUserByAdmin,{isLoading : createTeacherIsLoading}] = useCreateUserByAdminMutation();

    const onCreateUser = async (fullName:string)=>{
        await createUserByAdmin({fullName,role:"teacher"})
        refetch()
    }

    if(isLoading){
        return  <div></div>
    }

    if(error){
        return  <h1>ERROR</h1>
    }

    return (
        <TableUsers fileJPGName={"Преподаватели"} data={data || []} columns={columns} onCreateUser={onCreateUser} inputPlaceholder={"ФИО преподавателя"}/>
    )

};
