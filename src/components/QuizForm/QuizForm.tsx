import React, { memo, useEffect, useState } from "react";
import cls from './QuizForm.module.scss';
import {IAnswer, IQuiz} from "../../model/IQuiz";
import QuizFormInput, { InputTextSize } from "../QuizFormInput/QuizFormInput";
import {TextField} from "@mui/material";
import {RiDeleteBinLine} from "react-icons/ri";
import {IoIosClose} from "react-icons/io";
// eslint-disable-file
interface QuizFormProps {
    className?: string;
    quizData: IQuiz;
    answersData: IAnswer[];
    onChangeQuizData: (quiz: IQuiz) => void;
    onChangeAnswerData: (answer: IAnswer[]) => void;
}

export const QuizForm = memo((props: QuizFormProps) => {
    const { className, quizData,answersData ,onChangeQuizData,onChangeAnswerData} = props;

    const handleAnswerChange = (questionIndex:number,answerIndex:number,newTextAnswer:string)=>{
        const changedQuestions = quizData.questions.map((question,i)=>{
            if(questionIndex-1 === i){
                const answerOptions = question.answerOptions
                answerOptions[answerIndex] = newTextAnswer;
                const changedQuestion = {
                    ...question,
                    answerOptions:answerOptions,
                };
                return changedQuestion
            }else{
                return question;
            }
        });
        const changedAnswers = answersData.map((answer,i)=>{
            if(questionIndex-1 === i){
                return {
                    ...answer,
                    answer:newTextAnswer,
                }
            }else{
                return answer;
            }
        });
        onChangeAnswerData(changedAnswers);
        onChangeQuizData({...quizData,questions:changedQuestions});
    }
    const handleQuestionTextChange = (questionIndex:number,newTextQuestion:string)=>{
        const changedQuestions = quizData.questions.map((question,i)=>{
            if(questionIndex-1 === i){
                return {
                    ...question,
                    question:newTextQuestion,
                }
            }else{
                return question;
            }
        });
        onChangeQuizData({...quizData,questions:changedQuestions});
    }
    const handleTitleChange = (newTitleQuestion:string)=>{
        onChangeQuizData({...quizData,title:newTitleQuestion});
    }
    const handleQuestionAvailableUntilChange = (questionIndex:number,newAvailableUntil:string)=>{
        const changedQuestions = quizData.questions.map((question,i)=>{
            if(questionIndex-1 === i){
                return {
                    ...question,
                    availableUntil:newAvailableUntil,
                }
            }else{
                return question;
            }
        });
        onChangeQuizData({...quizData,questions:changedQuestions});
    }
    const handleTimeSecondsChange = (questionIndex:number,newTimeSeconds:number)=>{
        const changedQuestions = quizData.questions.map((question,i)=>{
            if(questionIndex-1 === i){
                return {
                    ...question,
                    timeSeconds:newTimeSeconds,
                }
            }else{
                return question;
            }
        });
        //@ts-ignore
        onChangeQuizData({...quizData,questions:changedQuestions});
    }
    const handleTrueAnswerChange = (questionIndex:number,answerIndex:number,newTextAnswer:string)=>{
        const changedAnswers = answersData.map((answer,i)=>{
            if(questionIndex-1 === i){
                return {
                    ...answer,
                    answer:newTextAnswer,
                }
            }else{
                return answer;
            }
        });
        onChangeAnswerData(changedAnswers);
    }

    const handleDeleteQuestion = (questionIndex: number) => {
        const updatedQuestions = quizData.questions
            .filter((_, index) => index !== questionIndex) // Удаляем вопрос
            .map((question, newIndex) => ({
                ...question,
                questionId: newIndex + 1
            }));

        const updatedAnswers = answersData
            .filter((_, index) => index !== questionIndex) // Удаляем ответ
            .map((answer, newIndex) => ({
                ...answer,
                questionId: newIndex + 1
            }));

        onChangeQuizData({ ...quizData, questions: updatedQuestions });
        onChangeAnswerData(updatedAnswers);
    };

    const createNewQuestion = ()=>{
        const newQuestionId = quizData.questions.length + 1
        const updatedQuestions = quizData.questions
        updatedQuestions.push( {
            questionId: newQuestionId,
            question: "Нажмите чтобы изменить вопрос №"+newQuestionId,
            answerOptions: [
                "Вариант Ответа №1",
                "Вариант Ответа №2",
                "Вариант Ответа №3",
                "Вариант Ответа №4",
            ]
        })
        const updatedAnswers = answersData
        updatedAnswers.push({
                answer: "Вариант Ответа №1",
                questionId: newQuestionId,
            })

        onChangeAnswerData(updatedAnswers);
        onChangeQuizData({...quizData,questions:updatedQuestions});
    }

    const handleDeleteAnswerOption = (questionIndex: number, answerIndex: number) => {
        const updatedQuestions = quizData.questions.map((question, i) => {
            if (i === questionIndex) {
                const updatedAnswerOptions = question.answerOptions.filter((_, index) => index !== answerIndex);
                return {
                    ...question,
                    answerOptions: updatedAnswerOptions,
                };
            }
            return question;
        });

        const updatedAnswers = answersData.map((answer, i) => {
            if (i === questionIndex && answer.answer === quizData.questions[questionIndex].answerOptions[answerIndex]) {
                return { ...answer, answer: "" };
            }
            return answer;
        });

        onChangeQuizData({ ...quizData, questions: updatedQuestions });
        onChangeAnswerData(updatedAnswers);
    };

    const handleAddAnswerOption = (questionIndex: number) => {
        const updatedQuestions = quizData.questions.map((question, i) => {
            if (i === questionIndex) {
                const newAnswerOption = `Вариант ответа №${question.answerOptions.length + 1}`;
                return {
                    ...question,
                    answerOptions: [...question.answerOptions, newAnswerOption], // Добавляем новый вариант
                };
            }
            return question;
        });

        onChangeQuizData({ ...quizData, questions: updatedQuestions });
    };

    const handleImageURLChange = (questionIndex:number,newImageURL:string)=>{
        const changedQuestions = quizData.questions.map((question,i)=>{
            if(questionIndex-1 === i){
                return {
                    ...question,
                    imageUrl:newImageURL,
                }
            }else{
                return question;
            }
        });
        //@ts-ignore
        onChangeQuizData({...quizData,questions:changedQuestions});
    }

    return (
        <div className={cls.QuizForm}>
            <div className={cls.QuizFormBlock}>
                <QuizFormInput
                    value={quizData.title}
                    onChange={(title)=>{
                        handleTitleChange(title);
                    }}
                    textSize={InputTextSize.XL}
                    placeholder={'Загаловок опроса'}
                    style={{width:'100%'}}
                />
            </div>

            {quizData.questions.map((question) => (
                <div key={question.questionId} className={cls.QuizFormBlock}>
                    <QuizFormInput
                        value={question.question}
                        onChange={(questionValue) => {
                            handleQuestionTextChange(question.questionId, questionValue)
                        }}
                        className={cls.QuizQuestionInput}
                        style={{width:'100%',fontSize:"18px"}}
                    />

                    <div className={cls.QuizFormIcons}>
                        <RiDeleteBinLine
                            className={cls.Icon}
                            title={"Удалить вопрос"}
                            onClick={() => handleDeleteQuestion(question.questionId - 1)}
                        />
                    </div>

                    <div className={cls.settings}>
                        <div className={cls.AnswerOptions}>
                            {question.answerOptions.map((answerOption, index) => (
                                <label className={cls.AnswerOptionLabel} key={index}>
                                    <input
                                        type="radio"
                                        name={`question-${question.questionId}`}
                                        value={answerOption}
                                        checked={answersData[question.questionId - 1]?.answer === answerOption}
                                        onChange={() => handleTrueAnswerChange(question.questionId, index, answerOption)}
                                        className={cls.AnswerOptionRadio}
                                    />
                                    <TextField
                                        value={answerOption}
                                        onChange={(e) => {
                                            handleAnswerChange(question.questionId, index, e.target.value);
                                        }}

                                        variant={"standard"}
                                    />
                                    <IoIosClose
                                        className={cls.Icon}
                                        title={"Удалить вариант ответа"}
                                        onClick={() => handleDeleteAnswerOption(question.questionId - 1, index)}
                                    />
                                </label>
                            ))}

                            <button
                                className={cls.AddAnswerOption}
                                onClick={() => handleAddAnswerOption(question.questionId - 1)}
                            >
                                + Добавить вариант ответа
                            </button>
                        </div>

                        <div className={cls.QuestionSettings}>
                            <TextField className={cls.input} value={question.timeSeconds} type={"number"} onChange={(e)=>{
                                handleTimeSecondsChange(question.questionId, Number(e.target.value));

                            }}  placeholder="Время выполнения (сек)" variant="standard"/>

                            <TextField className={cls.input} type={"url"} value={question.imageUrl} onChange={(e)=>{
                                handleImageURLChange(question.questionId, e.target.value);
                            }}  placeholder={"Ссылка на изображение"} variant="standard"/>
                        </div>
                    </div>

                </div>
            ))}

            <button className={cls.AddQuestion} onClick={() => {
                createNewQuestion()
            }}>
                Создать новый вопрос
            </button>
        </div>
    );
});
