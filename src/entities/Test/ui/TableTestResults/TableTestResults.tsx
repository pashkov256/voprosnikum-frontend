import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@mui/material';
import { useGetTestAllResultsQuery } from 'entities/Test/model/slice/testSlice';
import { ITestResult, ITestResultDetails, ITestWithPopulate } from 'entities/Test/model/types/test';
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import React, { useRef, useState } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { formatDate, formatDateTimeForInput } from "shared/lib/date";
import { getColorByScore } from "shared/lib/getColorByScore/getColorByScore";
import { Button, ButtonTheme } from 'shared/ui/Button/Button';
import Loader from 'shared/ui/Loader/Loader';
import cls from './TestResultsTable.module.scss';
import {SerializedError} from "@reduxjs/toolkit";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
interface TableTestResultsProps {
    testData?: ITestWithPopulate;
    testAllResults:  ITestResultDetails[] | undefined;
    testAllResultsIsLoading: boolean;
    testAllResultsError:  FetchBaseQueryError | SerializedError | undefined;
    setOpenModalTestResult: (open: boolean) => void;
    setTestResult: (testResult: ITestResultDetails | null) => void;
    id: string;
}

// interface TestResult {
//     student: {
//         fullName: string;
//     };
//     score: number;
//     testData?: ITestWithPopulate;
//     points: number;
//     completionTime: string; // Предположим, это строка
//     dateStart: string; // Предположим, это строка
// }

export const TableTestResults: React.FC<TableTestResultsProps> = ({ id, testData, setOpenModalTestResult, setTestResult,testAllResults ,testAllResultsIsLoading,testAllResultsError }) => {


    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [orderBy, setOrderBy] = useState<keyof ITestResult>('score');

    const handleRequestSort = (property: keyof ITestResult) => {
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
            {testAllResults?.length !== 0 ? (<TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={cls.tableCell}>
                                <TableSortLabel
                                    active={orderBy === 'student'}
                                    direction={orderBy === 'student' ? order : 'asc'}
                                    onClick={() => handleRequestSort('student')}
                                >
                                    ФИО
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
                                    active={orderBy === 'points'}
                                    direction={orderBy === 'points' ? order : 'asc'}
                                    onClick={() => handleRequestSort('points')}
                                >
                                    Баллы
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={cls.tableCell}>
                                <TableSortLabel
                                    active={orderBy === 'focusLossCount'}
                                    direction={orderBy === 'focusLossCount' ? order : 'asc'}
                                    onClick={() => handleRequestSort('focusLossCount')}
                                >
                                    Общее число отвлечений
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
                            <TableCell className={cls.tableCell}>
                                Подробная статистика
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row, index) => (
                            <TableRow key={index}>
                                {/*@ts-ignore*/}
                                <TableCell className={cls.tableCell}>{row.student?.fullName || ""}</TableCell>
                                <TableCell className={cls.tableCell} style={{ color: getColorByScore(row?.score || 1), fontWeight: 700 }}>{row?.score || 0}</TableCell>
                                <TableCell className={cls.tableCell}>{row?.points || 0} из {testData?.maxPoints}</TableCell>
                                <TableCell className={cls.tableCell}>{row.focusLossCount}</TableCell>
                                {/*<TableCell className={cls.tableCell} style={{color:getColorByScore(row?.score || 1),fontWeight:700}}>{row.score}</TableCell>*/}
                                <TableCell className={cls.tableCell}>{row.completionTime ? row.completionTime : "-"}</TableCell>
                                <TableCell className={cls.tableCell}>{formatDate(row.dateStart || "")}</TableCell><TableCell className={cls.tableCell}>{row.completedAt ? "Да" : "Нет"}</TableCell>
                                <TableCell className={cls.tableCell}>
                                    <Button theme={ButtonTheme.BACKGROUND} className={cls.tableCellButton} onClick={() => {
                                        setTestResult(row)
                                        setOpenModalTestResult(true)
                                    }}>Открыть</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>) : <h2 style={{ textAlign: "center" }}>Тест ещё никто не прошёл</h2>}
        </div>
    );
};
