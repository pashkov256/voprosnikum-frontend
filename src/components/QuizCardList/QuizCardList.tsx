import cls from './QuizCardList.module.scss';
import { IQuiz } from "../../model/IQuiz";
import { QuizListCard } from "../QuizListCard/QuizListCard";
import { IoIosAddCircleOutline } from "react-icons/io";
import {Link, useNavigate} from "react-router-dom";
import { useCreateTestMutation } from "entities/Test/model/slice/testSlice";

interface QuizCardListProps {
    className?: string;
    userId: string;
    quizes?: IQuiz[];
}

export const QuizCardList = (props: QuizCardListProps) => {
    const { quizes, userId } = props;
    const [createTest, { isLoading: newTestDataIsLoading }] = useCreateTestMutation();
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
            {/* {quizes.map((quize) => <QuizListCard quiz={quize} />)} */}
        </div>
    );
};
