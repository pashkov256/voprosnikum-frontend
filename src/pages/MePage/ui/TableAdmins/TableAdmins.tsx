import {
    useCreateUserByAdminMutation,
    useGetAdminsQuery,
    useGetTeachersQuery
} from "entities/Test/model/slice/testSlice";
import {TableUsers} from "../TableUsers/TableUsers";

interface TableTeachersProps {
}
const columns = [
    { header: 'ФИО', accessor: 'fullName' },
    { header: 'Логин', accessor: 'login' },
    { header: 'Пароль', accessor: 'plainPassword' },
];
export const TableAdmins = (props: TableTeachersProps) => {
    const {data,isLoading,error,refetch} = useGetAdminsQuery()
    const [createUserByAdmin,{isLoading : createTeacherIsLoading}] = useCreateUserByAdminMutation();

    const onCreateUser = async (fullName:string)=>{
        await createUserByAdmin({fullName,role:"admin"})
        refetch()
    }

    if(isLoading){
        return  <div></div>
    }

    if(error){
        return  <h1>ERROR</h1>
    }

    return (
        <TableUsers fileJPGName={"Администраторы"} data={data || []} columns={columns} onCreateUser={onCreateUser} inputPlaceholder={"ФИО администратора"}/>
    )

};
