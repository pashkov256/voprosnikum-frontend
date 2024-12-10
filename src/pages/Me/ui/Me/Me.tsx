import cls from 'pages/Me/ui/Me/Me.module.scss';
import {UserContext} from "context/UserContext";
import {useContext, useState} from "react";
import {IQuiz} from "model/IQuiz";
import {TableTeachers} from "pages/Me/ui/TableTeachers/TableTeachers";
import {Text, TextSize} from "shared/ui/Text/Text";
import {TableUsers} from "pages/Me/ui/TableUsers/TableUsers";

interface UserProps {
    className?: string;
}

export const Me = (props: UserProps) => {
    const { className } = props;
    const userData = useContext(UserContext);
    const userId = userData._id
    const isMe = userId === userData._id;
    const [allQuiz, setAllQuiz] = useState<IQuiz[]>([])
    const [allQuizIsLoading, setAllQuizIsLoading] = useState(true);


    return (
        <div className={cls.content}>

            {/*<div className={cls.quizList}>*/}
            {/*    <h3>{isMe ? "Ваши опросы" : "Квизы пользователя"}</h3>*/}
            {/*</div>*/}
            <Text title={"Список преподавателей"} size={TextSize.L}/>
            <TableTeachers />

            {/*{(!allQuizIsLoading) ? <QuizCardList quizes={allQuiz} /> : null}*/}
        </div>
    )

};


