import React, { useEffect, useState } from "react";
import "./Quiz.module.scss";
import axios from "axios";
import { Question } from "../../model/IQuiz";



//QUIZ PROVERKA
// try{
//   const {data} = await axios.get('http://localhost:8000/quize/1/question/2')
//   console.log(data)
// }catch{

// }


function QuizList({questions}:any) {
    console.log(questions)
    const [currentQuestion,setCurrentQuestion] = useState(0)

    const onContinue = ()=>{
        if(currentQuestion < questions.length-1 && currentQuestion !== questions.length-1){
            setCurrentQuestion(currentQuestion+1)
        }
    }

    return (
        <div>
            {
                // questions.map((question)=>{
                //     question
                // })
            }

            {
                questions[currentQuestion].question
            }

            <button onClick={onContinue}>продолжить</button>
        </div>
    );
}

export default QuizList;
