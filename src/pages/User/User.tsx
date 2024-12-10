import cls from './User.module.scss';
import {useParams} from 'react-router-dom';
import {UserContext} from "../../context/UserContext";
import {useContext, useEffect, useState} from "react";
import {FaUserCircle} from "react-icons/fa";
import {IQuiz} from "../../model/IQuiz";
import axios from "axios";
import {QuizCardList} from "../../components/QuizCardList/QuizCardList";

interface UserProps {
    className?: string;
}

export const User = (props: UserProps) => {
    const { className } = props;
    const {userId} = useParams();
    const userData = useContext(UserContext);
    const [allQuiz, setAllQuiz] = useState<IQuiz[]>([])
    const [allQuizIsLoading, setAllQuizIsLoading] = useState(true);
    const isMe = userId === userData._id;
    useEffect(() => {
        const allQuiz = async ()=>{
            try {
                const { data } = await axios.get<{quizes:IQuiz[]}>(
                    `http://localhost:3333/user/${userId}/quiz/all`
                );
                setAllQuiz(data.quizes);
            } catch (e) {

            } finally {
                setAllQuizIsLoading(false);
            }
        }
        allQuiz()
    }, []);
    return (
        <div className={cls.content}>

            <div className={cls.userCardWrapper}>
                <div className={cls.userCard}>
                    <FaUserCircle size={"128px"} fill={"#222"}/>
                    <span className={cls.userName}>{userData.fullName}</span>
                </div>
            </div>

            <div className={cls.quizList}>
                <h3>{isMe ? "Ваши квизы" : "Квизы пользователя"}</h3>
            </div>

            {!allQuizIsLoading ? <QuizCardList quizes={allQuiz} /> : null}

        </div>
    )

};
