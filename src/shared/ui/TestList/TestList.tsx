import cls from './TestList.module.scss';
import { IoIosAddCircleOutline } from "react-icons/io";
import {Link, useNavigate} from "react-router-dom";
import { useCreateTestMutation } from "entities/Test/model/slice/testSlice";
import { ITest } from 'entities/Test';
import { useGetTestsByTeacherQuery } from 'entities/Test/model/slice/testSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import { TestCard } from '../TestCard/TestCard';
interface TestListProps {
    className?: string;
    userId: string;
    tests?: ITest[];
}

export const TestList = (props: TestListProps) => {

    const { userId } = props;
    const [createTest, { isLoading: newTestDataIsLoading }] = useCreateTestMutation();
    const {data:tests,isLoading:testsIsLoading} = useGetTestsByTeacherQuery(userId)
    const navigate = useNavigate();
    const handleCreateTest = async () => {
        try {
            const newTestData = await createTest({ teacher: userId }).unwrap();
                navigate(`/test/${newTestData._id}/edit`)
        } catch (error) {
            console.error('Ошибка при создании теста:', error);
        }
    };

    return (
        <div className={cls.CardList}>
            <button className={cls.CardAdd} onClick={handleCreateTest}>
                <IoIosAddCircleOutline size={64} color={'#000'} />
                <span>Создать тест</span>
            </button>
            {(tests && !testsIsLoading) && tests.map((test) => <TestCard test={test} />)  }
        </div>
    );
};
