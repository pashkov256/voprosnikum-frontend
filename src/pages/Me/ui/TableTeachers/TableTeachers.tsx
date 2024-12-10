import {classNames} from 'shared/lib/classNames/classNames';
import cls from './TableUsers.module.scss';
import {useCreateUserByAdminMutation, useGetTeachersQuery} from "entities/Test/model/slice/testSlice";
import {Table} from "shared/ui/Table/Table";
import {useRef} from "react";
import {generatePDF} from "shared/lib/generatePDF/generatePDF";
import {Button, ButtonTheme} from "shared/ui/Button/Button";
import {Input} from "shared/ui/Input/Input";
import {TableUsers} from "pages/Me/ui/TableUsers/TableUsers";

interface TableTeachersProps {
    className?: string;
}

export const TableTeachers = (props: TableTeachersProps) => {
    const {className} = props;
    const {data,isLoading,error,refetch} = useGetTeachersQuery()
    const [createUserByAdmin,{isLoading : createTeacherIsLoading}] = useCreateUserByAdminMutation();
    const tableRef = useRef<HTMLTableElement | null>(null); //  реф  таблицы
    const data1 = [
        { fullName: 1, login: 'John Doe', plainPassword: 28, age1: 45  },
        { login: 2, name: 'Jane Smith', age: 34, age1: 132131  },
        { plainPassword: 3, name: 'Paul Johnson', age: 45, age1: 45  },
    ];

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
        return  <h1>loading</h1>
    }

    if(error){
        return  <h1>ERROR</h1>
    }

    const onCreateUser = async (fullName:string)=>{
         await createUserByAdmin({fullName,role:"teacher"})
        refetch()
    }
    return (
        <TableUsers data={data || data1} columns={columns} onCreateUser={onCreateUser}/>
    )

};
