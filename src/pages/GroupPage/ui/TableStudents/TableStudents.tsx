import {useCreateUserByAdminMutation} from "entities/Test/model/slice/testSlice";
import {useRef} from "react";
import Loader from "shared/ui/Loader/Loader";
import {TableUsers} from "pages/MePage/ui/TableUsers/TableUsers";
import {useGetStudentsByGroupQuery} from "entities/Group/model/slice/groupSlice";


export const TableStudents = ({groupId}:{groupId:string}) => {
    const {data,isLoading,error,refetch} = useGetStudentsByGroupQuery(groupId)
    console.log(groupId)
    const [createUserByAdmin,{isLoading : createTeacherIsLoading}] = useCreateUserByAdminMutation();
    const tableRef = useRef<HTMLTableElement | null>(null); //  реф  таблицы

    const columns = [
        { header: 'ФИО', accessor: 'fullName' },
        { header: 'Логин', accessor: 'login' },
        { header: 'Пароль', accessor: 'plainPassword' },
    ];
    const handleRowClick = (row: Record<string, any>) => {
        console.log('Row clicked:', row);
    };

    if(error){
        return  <h1>ERROR</h1>
    }
    if(isLoading){
        return  <Loader/>
    }



    const onCreateUser = async (fullName:string)=>{
        await createUserByAdmin({fullName,role:"student",group:groupId})
        refetch()
    }
    return (
        <TableUsers
            data={data || []}
            columns={columns}
            onCreateUser={onCreateUser}
            inputPlaceholder={"ФИО студента"}
            fileJPGName={"Студенты"}
        />
    )

};
