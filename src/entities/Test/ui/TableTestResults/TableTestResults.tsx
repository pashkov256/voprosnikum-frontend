import React, { useRef, useState } from 'react';
import { useGetTestAllResultsQuery } from 'entities/Test/model/slice/testSlice';
import Loader from 'shared/ui/Loader/Loader';
import { classNames } from 'shared/lib/classNames/classNames';
import cls from './TestResultsTable.module.scss';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
} from '@mui/material';
import {formatDate, formatDateTimeForInput} from "shared/lib/date";

interface TableTestResultsProps {
    id: string;
}

interface TestResult {
    student: {
        fullName: string;
    };
    score: number;
    completionTime: string; // Предположим, это строка
    dateStart: string; // Предположим, это строка
}

export const TableTestResults: React.FC<TableTestResultsProps> = ({ id }) => {
    const { data: testAllResults, isLoading: testAllResultsIsLoading, error: testAllResultsError } = useGetTestAllResultsQuery(id);

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof TestResult>('student');

    const handleRequestSort = (property: keyof TestResult) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = [...(testAllResults || [])].sort((a, b) => {
        if (order === 'asc') {
            //@ts-ignore
            return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
            //@ts-ignore
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    if (testAllResultsIsLoading) {
        return <Loader />;
    }

    if (testAllResultsError) {
        return <h1>ERROR</h1>;
    }

    return (
        <div className={classNames(cls.TableTeachers, {}, [])}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={cls.tableCell}>
                                <TableSortLabel
                                    active={orderBy === 'student'}
                                    direction={orderBy === 'student' ? order : 'asc'}
                                    onClick={() => handleRequestSort('student')}
                                >
                                    Имя фамилия
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={cls.tableCell}>
                                <TableSortLabel
                                    active={orderBy === 'score'}
                                    direction={orderBy === 'score' ? order : 'asc'}
                                    onClick={() => handleRequestSort('score')}
                                >
                                    Оценка
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={cls.tableCell}>
                                <TableSortLabel
                                    active={orderBy === 'completionTime'}
                                    direction={orderBy === 'completionTime' ? order : 'asc'}
                                    onClick={() => handleRequestSort('completionTime')}
                                >
                                    Время прохождения
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={cls.tableCell}>
                                <TableSortLabel
                                    active={orderBy === 'dateStart'}
                                    direction={orderBy === 'dateStart' ? order : 'asc'}
                                    onClick={() => handleRequestSort('dateStart')}
                                >
                                    Дата начала прохождения
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={cls.tableCell}>
                                Завершён ли тест
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row, index) => (
                            <TableRow key={index}>
                                {/*@ts-ignore*/}
                                <TableCell className={cls.tableCell}>{row.student?.fullName || ""}</TableCell>
                                <TableCell className={cls.tableCell} style={{color:(row.score || 1) <= 2 ? '#FF0000' :
                                        (row.score || 1) === 3 ? '#FFA500' :
                                            (row.score || 1) === 4 ? '#4CAF50' : (row.score || 1) === 5 ? '#388E3C' :  "#000000",fontWeight:700}}>{row.score}</TableCell>
                                <TableCell className={cls.tableCell}>{row.completionTime ? row.completionTime : "-"}</TableCell>
                                <TableCell className={cls.tableCell}>{formatDate(row.dateStart || "")}</TableCell><TableCell className={cls.tableCell}>{row.completedAt ? "Да" : "Нет"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
