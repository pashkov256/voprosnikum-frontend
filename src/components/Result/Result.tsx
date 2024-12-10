import React, { useEffect, useState } from "react";
import './Result.scss'

function Result({result,questionCount}:any) {
    const [conuntTrueAnswer,setConuntTrueAnswer] = useState(0)

    useEffect(() => {
        //@ts-ignore
        const countTrueAnswers =result.filter(element => element.correct).length
        setConuntTrueAnswer(countTrueAnswers)
    }, [result]);

    return (
        <div className="result-wrapper">
            <span className="result-text">Правильных ответов <br/> {conuntTrueAnswer} из {questionCount}</span>
        </div>
    );
}

export default Result;
