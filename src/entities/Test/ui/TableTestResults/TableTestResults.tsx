import {useGetTestAllResultsQuery} from "entities/Test/model/slice/testSlice";
import {useRef} from "react";
import Loader from "shared/ui/Loader/Loader";
import {classNames} from "shared/lib/classNames/classNames";
import cls from "./TestResultsTable.module.scss";
import {Table} from "shared/ui/Table/Table";

interface TableTestResultsProps {
    id:string
}

const columns = [
    { header: 'Имя фамилия ', accessor: 'student',accessorDeep:"fullName"},
    { header: 'Оценка', accessor: 'score' },
    { header: 'Время прохождения', accessor: 'completionTime' },
    { header: 'Дата начала прохождения', accessor: 'dateStart' },
    // { header: 'Количество пройденных вопросов', accessor: 'completionTime' },
];

export const TableTestResults = (props: TableTestResultsProps) => {
    const {id} = props;
    const {data:testAllResults,isLoading:testAllResultsIsLoading,error:testAllResultsError} = useGetTestAllResultsQuery(id)

    const tableRef = useRef<HTMLTableElement | null>(null);

    if(testAllResultsIsLoading){
        return  <Loader/>
    }

    if(testAllResultsError){
        return  <h1>ERROR</h1>
    }

    return (
        <div className={classNames(cls.TableTeachers, {}, [])}>

            <Table data={testAllResults || []} columns={columns}/>

        </div>
    )
};
