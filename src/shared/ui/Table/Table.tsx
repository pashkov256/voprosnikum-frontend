import React, {memo} from 'react';
import {classNames} from "shared/lib/classNames/classNames";
import cls from './Table.module.scss'
export interface Column {
    header: string; // Заголовок столбца
    accessor: string; // Ключ объекта данных
}

interface TableProps {
    data: any; // Массив данных
    // data: Array<Record<string, any>>; // Массив данных
    className?: string; // Массив данных
    columns: Column[]; // Массив настроек столбцов
    onRowClick?: (row: Record<string, any>) => void; // Обработчик клика на строку
}

export const Table: React.FC<TableProps> = memo(({ data, columns, onRowClick ,className}) => {
    return (
        <table className={classNames(cls.Table,{},[className])} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                {columns.map((column, index) => (
                    <th key={index}>
                        {column.header}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.length > 0 ? (
                //@ts-ignore
                data.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                        {columns.map((column, colIndex) => {
                            return <td key={colIndex} >

                                {row[column.accessor]}
                            </td>
                        })}
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={columns.length}>
                        No data available
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
});


