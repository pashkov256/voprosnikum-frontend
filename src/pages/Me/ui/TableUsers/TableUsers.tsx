import {classNames} from 'shared/lib/classNames/classNames';
import cls from './TableUsers.module.scss';
import {useGetTeachersQuery} from "entities/Test/model/slice/testSlice";
import {useRef, useState} from "react";
import {generatePDF} from "shared/lib/generatePDF/generatePDF";
import {Table} from "shared/ui/Table/Table";
import {Input} from "shared/ui/Input/Input";
import {Button, ButtonTheme} from "shared/ui/Button/Button";
interface Column {
    header: string; // Заголовок столбца
    accessor: string; // Ключ объекта данных
}
interface TableUsersProps {
    className?: string;
    data: any; // Массив данных
    columns: Column[]; // Массив настроек столбцов
    onCreateUser?: (fullName:string)=>void; // Массив настроек столбцов
}

export const TableUsers = (props: TableUsersProps) => {
    const {className,data,columns,onCreateUser} = props;
    const tableRef = useRef<HTMLTableElement | null>(null);
    const [fullNameValue, setFullNameValue] = useState('');
    const data1 = [
        { fullName: 1, login: 'John Doe', plainPassword: 28, age1: 45  },
        { login: 2, name: 'Jane Smith', age: 34, age1: 132131  },
        { plainPassword: 3, name: 'Paul Johnson', age: 45, age1: 45  },
    ];

    const handleRowClick = (row: Record<string, any>) => {
        console.log('Row clicked:', row);
    };
    const handleDownloadPDF = () => {
        generatePDF(tableRef.current, 'prepodovateli.pdf');
    };

    return (
        <div className={classNames(cls.TableTeachers, {}, [className])}>

            <div ref={tableRef}>
                <Table data={data || data1} columns={columns} onRowClick={handleRowClick}/>
            </div>
            <div className={cls.TableCreateUser}>
                <div className={cls.TableCreateUserForm}>
                    <Input placeholder={"Имя фамилия преподователя"} value={fullNameValue} onChange={(fullName)=>setFullNameValue(fullName)}/>

                    <Button onClick={()=>{
                        console.log("click")
                        if(fullNameValue !== undefined){
                            onCreateUser?.(fullNameValue)
                        } else {
                            alert('Укажите имя фамилию пользователя!!!')
                        }
                    }} theme={ButtonTheme.BACKGROUND}>
                        Добавить
                    </Button>
                </div>

                <Button onClick={handleDownloadPDF}  theme={ButtonTheme.BACKGROUND}>
                    Скачать таблицу в PDF
                </Button>

            </div>
        </div>
    )

};
