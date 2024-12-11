import {classNames} from 'shared/lib/classNames/classNames';
import cls from './TableUsers.module.scss';
import {useGetTeachersQuery} from "entities/Test/model/slice/testSlice";
import {useRef, useState} from "react";
import {generatePDF} from "shared/lib/generatePDF/generatePDF";
import {Column, Table} from "shared/ui/Table/Table";
import {Input} from "shared/ui/Input/Input";
import {Button, ButtonTheme} from "shared/ui/Button/Button";

interface TableUsersProps {
    className?: string;
    inputPlaceholder?: string;
    data: any; // Массив данных
    columns: Column[]; // Массив настроек столбцов
    onCreateUser?: (fullName:string)=>void; // Массив настроек столбцов
}

export const TableUsers = (props: TableUsersProps) => {
    const {className,data,columns,onCreateUser,inputPlaceholder} = props;
    const tableRef = useRef<HTMLTableElement | null>(null);
    const [fullNameValue, setFullNameValue] = useState('');

    const handleRowClick = (row: Record<string, any>) => {
        console.log('Row clicked:', row);
    };
    const handleDownloadPDF = () => {
        generatePDF(tableRef.current, 'преподователи.pdf');
    };

    return (
        <div className={classNames(cls.TableTeachers, {}, [className])}>


            {data.length > 0 ?
                <div ref={tableRef}>
                    <Table data={data || []} columns={columns} onRowClick={handleRowClick}/>
                </div>
                : null
            }
            <div className={cls.TableCreateUser}>
                <div className={cls.TableCreateUserForm}>
                    <Input placeholder={inputPlaceholder || "Имя и фамилия пользователя"} value={fullNameValue}
                           onChange={(fullName) => setFullNameValue(fullName)}/>

                    <Button onClick={() => {
                        console.log("click")
                        if (fullNameValue !== undefined) {
                            onCreateUser?.(fullNameValue)
                        } else {
                            alert('Укажите имя фамилию пользователя!!!')
                        }
                    }} theme={ButtonTheme.BACKGROUND}>
                        Добавить
                    </Button>
                </div>
                {data.length > 0 ?
                    <Button onClick={handleDownloadPDF} theme={ButtonTheme.BACKGROUND}>
                        Скачать таблицу в PDF
                    </Button>
                    : null
                }


            </div>

        </div>
    )

};
