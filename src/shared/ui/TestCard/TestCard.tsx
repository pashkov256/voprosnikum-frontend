import { ITest } from 'entities/Test';
import { useDeleteTestMutation } from "entities/Test/model/slice/testSlice";
import { RiDeleteBinLine, RiShareForwardLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { CLIENT_PROD_URL, SERVER_URL } from "shared/const/const";
import { formatDate, testIsOpenByDate } from "shared/lib/date";
import cls from './TestCard.module.scss';
import {isTestAvailable} from "shared/lib/date/isTestAvailable";

interface TestCardProps {
    className?: string;
    test: ITest;
}

export const TestCard = (props: TestCardProps) => {
    const { className, test } = props;
    const navigate = useNavigate();
    const [testDelete] = useDeleteTestMutation()
    return (
        <Link className={cls.Card} to={`/test/${test._id}/edit`}>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Тема:</span>
                <span className={cls.CardItemData}>{test.name}</span>
            </div>
            <div className={cls.CardIcons}>
                <RiDeleteBinLine className={cls.CardIcon} onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation()
                    try {
                        // await axios.delete(`${SERVER_URL}/quiz/${test._id}/delete`);
                        testDelete(test._id)
                        alert("Успешно удалено!")
                        // navigate('/me')
                        window.location.reload()
                    } catch (e) {
                        console.log(e)
                    }
                }}/>
                <RiShareForwardLine className={cls.CardIcon} onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    navigator.clipboard.writeText(`${CLIENT_PROD_URL}/test/${test._id}`);
                    alert('Ссылка скопирована');
                }}/>
            </div>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Количество вопросов:</span>
                <span className={cls.CardItemData}>{test.questions.length}</span>
            </div>
            {test?.startDate && <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Открыт с:</span>
                <span className={cls.CardItemData}>{formatDate(test?.startDate || "")}</span>
            </div>}
            {test?.deadline && <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Открыт до:</span>
                <span className={cls.CardItemData}>{formatDate(test?.deadline || "")}</span>
            </div>}
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Создано:</span>
                <span className={cls.CardItemData}>{formatDate(test.createdAt || "")}</span>
            </div>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Доступен для студентов:</span>
                <span
                    className={cls.CardItemData}>{((testIsOpenByDate(test?.deadline || '') || !test?.deadline) && (isTestAvailable(test?.startDate || ''))) ? 'Да' : 'Нет'}</span>
            </div>
            {/*<div className={cls.CardItem}>*/}
            {/*    <span className={cls.CardItemTitle}>Людей прошло:</span>*/}
            {/*     <span className={cls.CardItemData}>{Math.floor(test.peoplePassed / 2)}</span> */}
            {/*</div>*/}
        </Link>
    );
};
