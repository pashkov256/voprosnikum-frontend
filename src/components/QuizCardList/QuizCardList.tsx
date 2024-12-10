import cls from './QuizCardList.module.scss';
import {IQuiz} from "../../model/IQuiz";
import {QuizListCard} from "../QuizListCard/QuizListCard";
import {IoIosAddCircleOutline} from "react-icons/io";
import {Link} from "react-router-dom";

interface QuizCardListProps {
    className?: string;
    quizes:IQuiz[]
}

export const QuizCardList = (props: QuizCardListProps) => {
    const {quizes} = props
    return (
       <div className={cls.CardList} >
           <Link className={cls.CardAdd} to={'/quiz/create'}>
               <IoIosAddCircleOutline size={64} color={'#000'}/>
                <span>Создать опрос</span>
           </Link>
           {quizes.map((quize) => <QuizListCard quiz={quize}/>)}
       </div>
    )

};
