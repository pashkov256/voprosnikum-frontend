import { classNames } from 'shared/lib/classNames/classNames';
import cls from './TableUsers.module.scss';
import { useRef, useState } from "react";
import { Column, Table } from "shared/ui/Table/Table";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonTheme } from "shared/ui/Button/Button";
import html2canvas from 'html2canvas';

interface TableUsersProps {
    className?: string;
    inputPlaceholder?: string;
    data: any; // Массив данных
    columns: Column[]; // Массив настроек столбцов
    onCreateUser?: (fullName: string) => void; // Функция для создания пользователя
    fileJPGName?: string;
}

export const TableUsers = (props: TableUsersProps) => {
    const { className, data, columns, onCreateUser, inputPlaceholder, fileJPGName = 'список_пользователей' } = props;
    const tableRef = useRef<HTMLTableElement | null>(null);
    const [fullNameValue, setFullNameValue] = useState('');

    const handleRowClick = (row: Record<string, any>) => {
        console.log('Row clicked:', row);
    };

    const handleDownloadJPG = async () => {
        if (tableRef.current) {
            const canvas = await html2canvas(tableRef.current);
            const imgData = canvas.toDataURL('image/jpeg');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `${fileJPGName}.jpg`;
            link.click();
        }
    };

    return (
        <div className={classNames(cls.TableTeachers, {}, [className])}>
            {data.length > 0 ?
                <div ref={tableRef}>
                    <Table data={data} columns={columns} onRowClick={handleRowClick} />
                </div>
                : null
            }
            <div className={cls.TableCreateUser}>
                <div className={cls.TableCreateUserForm}>
                    <Input
                        className={cls.input}
                        placeholder={inputPlaceholder || "Имя и фамилия пользователя"}
                        value={fullNameValue}
                        onChange={(fullName) => setFullNameValue(fullName)}
                    />

                    <Button onClick={() => {
                        console.log("click");
                        if (fullNameValue) {
                            onCreateUser?.(fullNameValue);
                            setFullNameValue("")
                        } else {
                            alert('Укажите имя и фамилию пользователя!!!');
                        }
                    }} theme={ButtonTheme.BACKGROUND} className={cls.btnAddUser}
                    >
                        Добавить
                    </Button>
                </div>
                {data.length > 0 ?
                    <Button onClick={handleDownloadJPG} className={cls.btnDownload} theme={ButtonTheme.BACKGROUND}>
                        Скачать таблицу в JPG
                    </Button>
                    : null
                }
            </div>
        </div>
    );
};
