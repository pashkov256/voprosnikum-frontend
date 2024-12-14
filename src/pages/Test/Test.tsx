import {classNames} from 'shared/lib/classNames/classNames';
import cls from './Test.module.scss';
import {useNavigate, useParams} from "react-router-dom";
import {
    useCreateTestAnswerMutation,
    useCreateTestResultMutation,
    useGetTestByIdQuery,
    useGetTestResultQuery
} from "entities/Test/model/slice/testSlice";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "app/providers/StoreProvider/config/store";
import Loader from "shared/ui/Loader/Loader";
import {LuTimer} from "react-icons/lu";
import {RiQuestionAnswerLine} from "react-icons/ri";
import {Input} from "shared/ui/Input/Input";
import {Button, ButtonTheme} from "shared/ui/Button/Button";
import formatDate from "shared/lib/formatDate/formatDate";
import isPastDate from "shared/lib/isPastDate/isPastDate";
import {getMinutesDifferenceFromNow} from "shared/lib/getMinutesDifferenceFromNow/getMinutesDifferenceFromNow";
import Login from "pages/Login/Login";

interface TestProps {
    className?: string;
}

export const Test = (props: TestProps) => {
    const { className } = props;
    const { testId } = useParams();
    const userData = useSelector((state: RootState) => state.auth.data);
    const { data: testData, isLoading: testDataIsLoading, refetch: refetchGetTest } = useGetTestByIdQuery({ _id: testId || "" });
    const [createTestResult, { isLoading: createTestResultIsLoading  }] = useCreateTestResultMutation();
    const [createTestAnswer, { isLoading: createTestAnswerIsLoading }] = useCreateTestAnswerMutation();
    //@ts-ignore
    const { data: testResult,refetch:refetchTestResult } = useGetTestResultQuery({ test: testId || "", student: userData?._id || "" });

    const [testStarted, setTestStarted] = useState(false);  // Состояние для отслеживания начала теста
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null); // Таймер на вопрос
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [shortAnswerValue, setShortAnswerValue] = useState<string>("");
    const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const [buttonsIsDisabled, setButtonsIsDisabled] = useState(false);

    const [testSecondsLeft, setTestSecondsLeft] = useState<number | null>(null); // Новый таймер на весь тест

    const navigate = useNavigate();

    // Таймер для вопросовg
    useEffect(() => {
        if (secondsLeft === null) return;
        if (secondsLeft > 0) {
            const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            let c = async ()=>{
                alert("Время вышло на вопрос! :(");


                setButtonsIsDisabled(true);
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect:false})
                //@ts-ignore
                if(currentQuestion +2 !== testData.questions.length){
                    setCurrentQuestion((prev)=>prev+1)
                }
                if(!createTestResultIsLoading){
                    await refetchTestResult()
                    setButtonsIsDisabled(false);
                }


                setUserAnswers((prev) => [...prev, { correct: false }]);
            }
            c()
        }
    }, [secondsLeft]);
    // Таймер для всего теста
    useEffect(() => {
        console.log(`testSecondsLeft ${testSecondsLeft}`)
        if (testSecondsLeft === null) return;

        if (testSecondsLeft > 0) {
            const timer = setTimeout(() => setTestSecondsLeft(testSecondsLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            alert("ВРЕМЯ КОНЧИЛОСЬ НА ТЕСТ!");

            setTestStarted(false);
            setButtonsIsDisabled(true);
        }
    }, [testSecondsLeft]);

    // Инициализация данных теста и таймера на тест
    useEffect(() => {
       const init = async ()=>{
           if (testData) {
               document.title = testData.name;
               if (testData?.deadline) {
                   if (isPastDate(testData?.deadline)) {
                       if (testData?.haveTestResult) {
                           setTestStarted(true);
                           //@ts-ignore
                           if(testResult.testAnswers.length + 1 > testData?.questions.length){
                               setIsComplete(true)
                           }
                           //@ts-ignore
                           setCurrentQuestion(testResult.testAnswers.length + 1)

                           console.log(currentQuestion)
                           //@ts-ignore
                           if (testResult.testAnswers.length +1 === testResult.testAnswers.length +1) {
                               console.log(`TIIIMEMEMEME haveTestResult ${testData?.haveTestResult}`)
                               //@ts-ignore
                               if (testData.questions[testResult.testAnswers.length +1].timeLimit !== undefined) {
                                   //@ts-ignore
                                   setSecondsLeft(testData.questions[testResult.testAnswers.length +1].timeLimit);
                               }
                           }
                       } else {
                           if (testStarted) {
                               //@ts-ignore
                               await createTestResult({ test: testId, student: userData._id, dateStart: new Date().toISOString() });
                               if(!createTestResultIsLoading){
                                   refetchTestResult()
                               }
                               console.log("CREATETESTRESULT")
                               if (currentQuestion === 0) {
                                   if (testData.questions[0].timeLimit !== undefined) {
                                       setSecondsLeft(testData.questions[0].timeLimit);
                                   }
                               }
                           }
                       }
                   } else {
                       alert("Тест не актуален");
                       navigate('/');
                   }
               } else {
                   // if (testStarted) {
                   //     if (currentQuestion === 0) {
                   //         console.log("TIIIMEMEMEME")
                   //         if (testData.questions[0].timeLimit !== undefined) {
                   //             setSecondsLeft(testData.questions[0].timeLimit);
                   //         }
                   //     }
                   // }
                   if (testData?.haveTestResult) {
                       //@ts-ignore
                       if(testResult.testAnswers.length + 1 > testData?.questions.length){
                           setIsComplete(true)
                       }
                       setTestStarted(true);
                       //@ts-ignore
                       setCurrentQuestion(testResult.testAnswers.length)
                       //@ts-ignore
                       console.log(testResult.testAnswers.length)
                       //@ts-ignore
                       if (testResult.testAnswers.length  === testResult.testAnswers.length ) {
                           console.log(`TIIIMEMEMEME haveTestResult ${testData?.haveTestResult}`)
                           //@ts-ignore
                           if (testData.questions[testResult.testAnswers.length]?.timeLimit !== undefined) {
                               //@ts-ignore
                               setSecondsLeft(testData.questions[testResult.testAnswers.length ]?.timeLimit);
                           }
                       }
                   } else {
                       if (testStarted) {
                           //@ts-ignore
                           await createTestResult({ test: testId, student: userData._id, dateStart: new Date().toISOString() });
                           if(!createTestResultIsLoading){
                               refetchTestResult()
                           }
                           console.log("CREATETESTRESULT")
                           if (currentQuestion === 0) {
                               if (testData.questions[0].timeLimit !== undefined) {
                                   setSecondsLeft(testData.questions[0].timeLimit);
                               }
                           }
                       }
                   }
                   // if (testData?.haveTestResult) {
                   //     setTestStarted(true);
                   //     if (currentQuestion === 0) {
                   //         if (testData.questions[0].timeLimit !== undefined) {
                   //             setSecondsLeft(testData.questions[0].timeLimit);
                   //         }
                   //     }
                   // } else {
                   //     if (testStarted) {
                   //         //@ts-ignore
                   //         createTestResult({ test: testId, student: userData._id, dateStart: new Date().toISOString() });
                   //         if (currentQuestion === 0) {
                   //             if (testData.questions[0].timeLimit !== undefined) {
                   //                 setSecondsLeft(testData.questions[0].timeLimit);
                   //             }
                   //         }
                   //     }
                   // }
               }

               // Инициализация таймера на весь тест
               if (testResult?.dateStart && testData?.timeLimit && testData?.timeLimit !== 0) {
                   const startDate = new Date(testResult.dateStart).getTime();
                   const now = new Date().getTime();
                   const totalTime = testData.timeLimit * 60; // Время в секундах
                   const elapsedTime = Math.floor((now - startDate) / 1000);
                   const remainingTime = totalTime - elapsedTime;
                   setTestSecondsLeft(remainingTime > 0 ? remainingTime : 0);
               }
           }
       }
        init()
    }, [testData, testStarted, testResult]);

    const handleStartTest = () => {
        setTestStarted(true); // Начинаем тест по клику
    };

    const handleNextQuestion = async () => {
        if (currentQuestion >= (testData?.questions?.length || 1) - 1) {
            setIsComplete(true);
            console.log(testResult?._id)
            //@ts-ignore
            console.log(`testData.questions[currentQuestion].type ${testData.questions[currentQuestion].type}`)
            //@ts-ignore
            if(testData.questions[currentQuestion].type == "short-answer"){

                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect: shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0]})
                    //@ts-ignore
                console.log(`shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0]   ${shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0]}`)
            }else {
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect:selectedOptions.every(option => testData.questions[currentQuestion].correctAnswers.includes(option))})
            }

            await refetchTestResult()
            if(!createTestAnswerIsLoading && !createTestResultIsLoading){
                console.log(testResult)
            }

        } else {
            console.log(testResult?._id)
            //@ts-ignore
            if(testData.questions[currentQuestion].type == "short-answer"){

                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect: shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0]})
                //@ts-ignore
                console.log(`shortAnswerValue (${shortAnswerValue}) == testData.questions[currentQuestion].correctAnswers[0] (${testData.questions[currentQuestion].correctAnswers[0]})   ${shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0]}`)
            }else {
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect:selectedOptions.every(option => testData.questions[currentQuestion].correctAnswers.includes(option))})
            }
            //@ts-ignore
            // await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect:selectedOptions.every(option => testData.questions[currentQuestion].correctAnswers.includes(option))})
            // //@ts-ignore
            // console.log({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect:selectedOptions.every(option => testData.questions[currentQuestion].correctAnswers.includes(option))})

            setCurrentQuestion((prev) => prev + 1);
            setSelectedOptions([]);
            setButtonsIsDisabled(false);
            setShortAnswerValue("")
            refetchTestResult()
            if (testData) {
                if (testData.questions[currentQuestion + 1]?.timeLimit !== undefined) {
                    //@ts-ignore
                    setSecondsLeft(testData.questions[currentQuestion + 1]?.timeLimit);
                }
            }
        }
    };

    if (testDataIsLoading && !testData) {
        return <Loader />;
    }

    if (testData) {
        if (!testStarted) {
            return (
                <div className={cls.blockStart}>
                    <div className={cls.blockStartInfoWrapper}>
                        <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Название теста:</span>
                            <span className={cls.blockStartInfoRight}>{testData.name}</span>
                        </div>
                        <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Преподаватель:</span>
                            {/* @ts-ignore */}
                            <span className={cls.blockStartInfoRight}>{testData.teacher?.fullName}</span>
                        </div>
                        {testData?.timeLimit && testData?.timeLimit !== 0 ? <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Ограничение по времени:</span>
                            <span className={cls.blockStartInfoRight}>{testData?.timeLimit} минут</span>
                        </div> : null}
                        {testData?.deadline && <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Тест актуален до:</span>
                            <span className={cls.blockStartInfoRight}>{formatDate(testData?.deadline)}</span>
                        </div>}
                        <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Количество вопросов:</span>
                            <span className={cls.blockStartInfoRight}>{testData.questions.length}</span>
                        </div>


                    </div>
                    <Button className={cls["buttonStart"]} theme={ButtonTheme.BACKGROUND} onClick={handleStartTest}>
                        Начать тест
                    </Button>
                </div>
            );
        }

        return (
            <div className={cls.testWrapper}>
                {testData.timeLimit !== 0 && <h1 className={cls.testSecondLeftTitle} style={(testSecondsLeft !== null && !(testSecondsLeft > 0)) ? {display:"none"}  : {}}>Осталось времени на
                    тест: {Math.floor((testSecondsLeft || 0) / 60)}:{(testSecondsLeft || 0) % 60}</h1>}
                <div className={cls.quiz}>
                    {/*<div className={cls["quiz-header"]}>*/}
                    {/*    <h1 className={cls['header-title']}>Опрос на тему: {testData.name}</h1>*/}
                    {/*    <h1>Осталось времени на тест: {Math.floor((testSecondsLeft || 0) / 60)}:{(testSecondsLeft || 0) % 60}</h1>*/}
                    {/*</div>*/}
                    <div className={cls["quiz-wrapper"]}>
                        {(testSecondsLeft !== null && !(testSecondsLeft > 0)) ? <h1>Время кончилось</h1>  : <>
                            {isComplete ? (
                                <h1>Ваша оценка:
                                    {/*@ts-ignore*/}
                                     {` ${testResult.score}`}
                                </h1>
                            ) : (
                                <>
                                    {secondsLeft !== null && (
                                        <div className={classNames(cls["quiz-timer"], {}, [cls.quizIconBlock])}>
                                            <LuTimer size={32}/>
                                            <span className={cls["timer-text"]}>{secondsLeft}</span>
                                        </div>
                                    )}
                                    <div className={classNames(cls["quiz-question-count"], {}, [cls.quizIconBlock])}>
                                        <RiQuestionAnswerLine size={32}/>
                                        <span
                                            className={cls["question-count-text"]}>{currentQuestion + 1} из {testData.questions.length}</span>
                                    </div>
                                    <div style={{width: '100%'}}>
                                        <div className={cls["question-text-wrapper"]}>
                                            <h3 className={cls["question-text"]}>{testData.questions[currentQuestion].title1}</h3>
                                        </div>
                                        {testData.questions[currentQuestion]?.imageUrl && (
                                            <div className={cls.quizImageBlock}>
                                                <img src={testData.questions[currentQuestion].imageUrl || ""}
                                                     className={cls["quizImage"]}/>
                                            </div>
                                        )}
                                        {testData.questions[currentQuestion].type === "multiple-choice" ? (
                                            <div className={cls["quiz-questions"]}>
                                                {testData.questions[currentQuestion].options.map((option: string) => (
                                                    <button
                                                        key={option}
                                                        className={classNames(cls["quiz-question"], {
                                                            [cls.optionSelected]: selectedOptions.includes(option),
                                                        })}
                                                        onClick={() => setSelectedOptions((prev) =>
                                                            prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
                                                        )}
                                                        disabled={buttonsIsDisabled}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className={cls.shortAnswerBlock}>
                                                <Input placeholder={"Введите ответ"} className={cls.shortAnswerInput} value={shortAnswerValue} onChange={(value)=>setShortAnswerValue(value)}/>
                                            </div>
                                        )}
                                        <button
                                            className={cls["btn-continue"]}
                                            onClick={handleNextQuestion}
                                        >
                                            {currentQuestion >= testData.questions.length - 1 ? "Завершить" : "Продолжить"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>}
                    </div>
                </div>
            </div>
        );
    }

    return <div></div>;
};
