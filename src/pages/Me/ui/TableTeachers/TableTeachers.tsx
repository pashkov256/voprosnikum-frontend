import {useCreateUserByAdminMutation, useGetTeachersQuery} from "entities/Test/model/slice/testSlice";
import {useRef} from "react";
import {generatePDF} from "shared/lib/generatePDF/generatePDF";
import {TableUsers} from "pages/Me/ui/TableUsers/TableUsers";
import Loader from "shared/ui/Loader/Loader";

interface TableTeachersProps {
}

export const TableTeachers = (props: TableTeachersProps) => {
    const {data,isLoading,error,refetch} = useGetTeachersQuery()
    const [createUserByAdmin,{isLoading : createTeacherIsLoading}] = useCreateUserByAdminMutation();
    const tableRef = useRef<HTMLTableElement | null>(null); //  реф  таблицы

    const columns = [
        { header: 'Имя Фамилия', accessor: 'fullName' },
        { header: 'Логин', accessor: 'login' },
        { header: 'Пароль', accessor: 'plainPassword' },
    ];
    const handleRowClick = (row: Record<string, any>) => {
        console.log('Row clicked:', row);
    };
    const handleDownloadPDF = () => {
        generatePDF(tableRef.current, 'table.pdf');
    };

    if(isLoading){
        return  <Loader/>
    }

    if(error){
        return  <h1>ERROR</h1>
    }

    const onCreateUser = async (fullName:string)=>{
         await createUserByAdmin({fullName,role:"teacher"})
        refetch()
    }
    return (
        <TableUsers data={data || []} columns={columns} onCreateUser={onCreateUser} inputPlaceholder={"Имя и фамилия преподователя"}/>
    )

};
