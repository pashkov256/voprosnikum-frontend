import { ITest } from 'entities/Test';
import cls from './TestCard.module.scss';
import { RiDeleteBinLine } from "react-icons/ri";
import { RiShareForwardLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import {CLIENT_PROD_URL, SERVER_URL} from "shared/const/const";

interface TestCardProps {
    className?: string;
    test: ITest;
}

export const TestCard = (props: TestCardProps) => {
    const { className, test } = props;
    const navigate = useNavigate();

    return (
        <Link className={cls.Card} to={`/quiz/${test._id}/edit`}>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Тема:</span>
                <span className={cls.CardItemData}>{test.name}</span>
            </div>
            <div className={cls.CardIcons}>
                {/* <RiDeleteBinLine className={cls.CardIcon} onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation()
                    try {
                        await axios.delete(`${SERVER_URL}/quiz/${test._id}/delete`);
                        alert("Успешно удалено!")
                        navigate('/login')
                    } catch (e) {
                        console.log(e)
                    }
                }}/> */}
                <RiShareForwardLine className={cls.CardIcon} onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    navigator.clipboard.writeText(`${CLIENT_PROD_URL}/quiz/${test._id}`);
                    alert('Ссылка скопирована');
                }}/>
            </div>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Количество вопросов:</span>
                <span className={cls.CardItemData}>{test.questions.length}</span>
            </div>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Создано:</span>
                <span className={cls.CardItemData}>{test.createdAt}</span>
            </div>
            {test?.deadline && <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Открыт до:</span>
                <span className={cls.CardItemData}>{test.deadline}</span>
            </div>}
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Открыт:</span>
                {/* <span className={cls.CardItemData}>{quizDateActual(quiz?.availableUntil || '') ? 'Да' : 'Нет'}</span> */}
            </div>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Людей прошло:</span>
                {/* <span className={cls.CardItemData}>{Math.floor(test.peoplePassed / 2)}</span> */}
            </div>
        </Link>
    );
};
