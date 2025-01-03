import { RootState } from "app/providers/StoreProvider/config/store";
import {
    useCreateTestAnswerMutation,
    useCreateTestResultMutation,
    useGetTestByIdQuery,
    useGetTestResultQuery, useUpdateTestResultMutation
} from "entities/Test/model/slice/testSlice";
import React, { useEffect, useState } from "react";
import { LuTimer } from "react-icons/lu";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { classNames } from 'shared/lib/classNames/classNames';
import {formatDate, testIsOpenByDate} from "shared/lib/date";
import isPastDate from "shared/lib/isPastDate/isPastDate";
import { Button, ButtonTheme } from "shared/ui/Button/Button";
import { Input } from "shared/ui/Input/Input";
import Loader from "shared/ui/Loader/Loader";
import cls from 'pages/TestPage/ui/TestPage.module.scss';
import {formatTimeDifference} from "shared/lib/date/formatTimeDifference";
import {getColorByScore} from "shared/lib/getColorByScore/getColorByScore";
import {Container} from "@mui/material";
import { IoMdTime } from "react-icons/io";
interface TestProps {
    className?: string;
}

const TestPage = (props: TestProps) => {
    const { className } = props;
    const { testId } = useParams<{testId:string}>();
    const userData = useSelector((state: RootState) => state.auth.data);
    const { data: testData, isLoading: testDataIsLoading, refetch: refetchGetTest } = useGetTestByIdQuery({ _id: testId || "" });
    const [createTestResult, { isLoading: createTestResultIsLoading }] = useCreateTestResultMutation();
    const [createTestAnswer, { isLoading: createTestAnswerIsLoading }] = useCreateTestAnswerMutation();
    //@ts-ignore
    const { data: testResult,isLoading:testResultIsLoading,refetch:refetchTestResult } = useGetTestResultQuery({ test: testId || "", student: userData?._id });
    //@ts-ignore
    console.log(`userData?._id ${userData?._id}`)
    const  [updateTestResult] = useUpdateTestResultMutation()
    const [testStarted, setTestStarted] = useState(false);  // Состояние для отслеживания начала теста
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [testIsOverdue, setTestIsOverdue] = useState(false);//просрочен ли тест, true по deadline, и по timeStart(в testResult)
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null); // Таймер на вопрос
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const [buttonsIsDisabled, setButtonsIsDisabled] = useState(false);
    const [shortAnswerValue, setShortAnswerValue] = useState<string>("");
    const [testSecondsLeft, setTestSecondsLeft] = useState<number | null>(null); // Новый таймер на весь тест

    const navigate = useNavigate();
    console.log(secondsLeft)
    // Таймер для вопросов

    useEffect(() => {
        if (secondsLeft === null) return;
        if (secondsLeft > 0) {
            const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            let c = async ()=>{
                alert("Время вышло на вопрос!");

                setSecondsLeft(null)
                setButtonsIsDisabled(true);
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect:false,isTimeFail:true})
                // if(!createTestResultIsLoading){
                //     await refetchTestResult()
                //     // setButtonsIsDisabled(false);
                // }
                //@ts-ignore
                if(currentQuestion +2 !== testData.questions.length){
                    setCurrentQuestion((prev)=>prev+1)
                }
                if(!createTestResultIsLoading){
                    await refetchTestResult()
                    // setButtonsIsDisabled(false);
                }


                setUserAnswers((prev) => [...prev, { correct: false }]);
                setButtonsIsDisabled(false);
            }
            c()
        }
    }, [secondsLeft]);

    // useEffect(() => {
    //     if (secondsLeft === null) return;
    //
    //     if (secondsLeft > 0) {
    //         const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    //         return () => clearTimeout(timer);
    //     } else {
    //         alert("Время вышло на вопрос! :(");
    //         setButtonsIsDisabled(true);
    //         setUserAnswers((prev) => [...prev, { correct: false }]);
    //     }
    // }, [secondsLeft]);

    // Таймер для всего теста
    useEffect(() => {
        if (testSecondsLeft === null) return;
        if (testSecondsLeft > 0) {
            const timer = setTimeout(() => setTestSecondsLeft(testSecondsLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {


            const completedAt = new Date().toISOString()
            updateTestResult({completedAt,completionTime:formatTimeDifference(testResult?.dateStart || "",completedAt),id:testResult?._id || ""})
            alert("Время выполнения теста кончилось!");
            window.location.reload();
        }
    }, [testSecondsLeft]);

    // Инициализация данных теста и таймера на тест

    const setupTestBasedOnResults = async ()=>{
        if(testResult !== undefined){
            if (testStarted) {
                initialTestTimer()
                if (currentQuestion === 0) {
                    if(testData !== undefined){
                        if (testData.questions[0].timeLimit !== undefined) {
                            setSecondsLeft(testData.questions[0].timeLimit);
                        }
                    }
                }
                console.log(`testResult?.testAnswers?.length  ${testResult?.testAnswers?.length}`)
                // @ts-ignore

                console.log({currentQuestion,QUESTIONSLENGTH:testData.questions.length})
                console.log({isComplete})
                // console.log(`testData?.questions[testResult?.testAnswers?.length +1].timeLimit`)
                // @ts-ignore

                if((currentQuestion !== testData.questions.length) && !isComplete){
                    // @ts-ignore
                    if (testData.questions[currentQuestion].timeLimit !== undefined) {
                    // if (testData.questions[testResult.testAnswers.length].timeLimit !== undefined) {
                        // @ts-ignore
                        setSecondsLeft(testData.questions[currentQuestion].timeLimit);

                    }
                } else {
                    setTestSecondsLeft(null)
                    const completedAt = new Date().toISOString()
                    await updateTestResult({completedAt,completionTime:formatTimeDifference(testResult?.dateStart || "",completedAt),id:testResult?._id || ""})
                    if(!createTestAnswerIsLoading && !createTestResultIsLoading){
                        console.log(testResult)

                        setIsComplete(true);
                        setTestSecondsLeft(null)
                    }
                }
            }
            if(testResult?.completedAt){//тесть пройден
                setIsComplete(true)
            }else {//тест не пройден
                setCurrentQuestion(testResult?.testAnswers?.length || 0)
                initialTestTimer()
                setTestStarted(true);
            }
        }
    }

    useEffect(() => {
        if (testData) {
            document.title = testData.name;
            if (testData?.deadline) {//если срок выполнения теста до какого то числа?
                if (isPastDate(testData?.deadline)) {//актуален ли тест?
                    setupTestBasedOnResults()
                } else {
                    if(!testData.isResultVisibleAfterDeadline){
                        alert("Тест не актуален");
                        navigate('/');
                    }
                    if(testResult){
                        if(testResult?.completedAt){
                            setIsComplete(true)
                        }
                    }
                }
            } else {
                setupTestBasedOnResults()
            }

        }
    }, [testData, testStarted, testResult]);

    useEffect(()=>{
        if(isComplete){
            setSecondsLeft(null)
        }
    },[isComplete])

    const initialTestTimer = (dateStart?:string | undefined)=>{
        if (testData?.timeLimit) {
            //@ts-ignore
            let startDate:number = 0
            if(dateStart){
                startDate =  new Date(dateStart).getTime();
            }
            if(testResult?.dateStart){
                startDate =  new Date(testResult?.dateStart || "").getTime();
            }
            const now = new Date().getTime();
            const totalTime = testData.timeLimit * 60; // Время в секундах
            const elapsedTime = Math.floor((now - startDate) / 1000);
            const remainingTime = totalTime - elapsedTime;
            setTestSecondsLeft(remainingTime > 0 ? remainingTime : 0);
        }
    }

    const handleStartTest = async () => {
        setButtonsIsDisabled(false);
        if(!testResult){
            const newDateStart = new Date().toISOString()
            //@ts-ignore
            await createTestResult({ test: testId, student: userData._id, dateStart: newDateStart });
            await refetchTestResult
            if(!createTestResultIsLoading){
                await refetchTestResult()
            }
            if(!testResultIsLoading){
                initialTestTimer(newDateStart)
                setTestStarted(true);
            }

        }else {
            if(testResult.completedAt){//ТЕСТ ЗАВЕРШЕН
                // alert('УЖЕ ЗАВЕРШЕН АЛЬФА')
                setIsComplete(true)

            } else {
                initialTestTimer()
            }
        }
    };

    const handleNextQuestion = async () => {
        // console.log(testResult)
        // console.log("TEST REUSLT ON CLICK")
        setSecondsLeft(null);

        if(currentQuestion >=( testData?.questions?.length || 1)){
            // alert('ЗАВЕРШЕНО')
            // console.log("ZAVERSHENO")
        }
        if (currentQuestion >= (testData?.questions?.length || 1) - 1) {
            console.log(testResult)
            console.log(`testResult?._id ${testResult?._id}`)
            //@ts-ignore
            // if(testData.questions[currentQuestion].type == "short-answer"){
            //     //@ts-ignore
            //     await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect: shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0],shortAnswerValue:shortAnswerValue})
            // }else {
            //     //@ts-ignore
            //     await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect:selectedOptions.every(option => testData.questions[currentQuestion].correctAnswers.includes(option))})
            // }
            if(testData.questions[currentQuestion].type == "short-answer"){
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect: shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0]})
                     //@ts-ignore
            }else if(testData.questions[currentQuestion].type == "multiple-choice"){
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,correctAnswers:testData.questions[currentQuestion].correctAnswers,selectedAnswerOptions:selectedOptions})
                     //@ts-ignore
            }  else if(testData.questions[currentQuestion].type == "single-choice"){
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect: selectedOptions.includes(testData.questions[currentQuestion].correctAnswers[0])})
            }
            // setCurrentQuestion(1)

            const completedAt = new Date().toISOString()
            await updateTestResult({completedAt,completionTime:formatTimeDifference(testResult?.dateStart || "",completedAt),id:testResult?._id || ""})
            await refetchTestResult()
            if(!createTestAnswerIsLoading && !createTestResultIsLoading){
                console.log(testResult)

                setIsComplete(true);

                setTestSecondsLeft(null)

            }

        } else {
            setCurrentQuestion((prev) => prev + 1);
            //@ts-ignore
            // if(testData.questions[currentQuestion].type == "short-answer"){
            //     //@ts-ignore
            //     await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect: shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0]})
            //
            // }else {
            //     //@ts-ignore
            //     await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect:selectedOptions.every(option => testData.questions[currentQuestion].correctAnswers.includes(option))})
            // }
            if(testData.questions[currentQuestion].type == "short-answer"){
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect: shortAnswerValue == testData.questions[currentQuestion].correctAnswers[0]})
                //@ts-ignore
            }else if(testData.questions[currentQuestion].type == "multiple-choice"){
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,correctAnswers:testData.questions[currentQuestion].correctAnswers,selectedAnswerOptions:selectedOptions})
                //@ts-ignore
            } else if(testData.questions[currentQuestion].type == "single-choice"){
                //@ts-ignore
                await createTestAnswer({testResult:testResult?._id || "",question:testData.questions[currentQuestion]._id,isCorrect: selectedOptions.includes(testData.questions[currentQuestion].correctAnswers[0])})
            }
            // setCurrentQuestion((prev) => prev + 1);
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
        if (!testStarted && !isComplete) {
            return (
                <Container maxWidth="lg"  className={cls.testContainer}>
                <div className={cls.blockStart}>
                    <div className={cls.blockStartInfoWrapper}>
                        <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Название теста:</span>
                            <span className={cls.blockStartInfoRight}>{testData.name}</span>
                        </div>
                        {testData.description && <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Описание теста:
                            <span className={classNames(cls.blockStartInfoRight,{},[cls.blockStartInfoDescription])}>{testData.description}</span>
                            </span>
                        </div>}
                        <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Преподаватель:</span>
                            {/* @ts-ignore */}
                            <span className={cls.blockStartInfoRight}>{testData.teacher?.fullName}</span>
                        </div>
                        {testData?.timeLimit && testData?.timeLimit !== 0 ? <div className={cls.blockStartInfo}>
                            <span className={cls.blockStartInfoLeft}>Ограничение по времени:</span>
                            <span className={cls.blockStartInfoRight}>{testData?.timeLimit} минут</span>
                        </div> :null    }
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
                </Container>
            );
        }

        if(isComplete && testResult) {

            let resultBlock = (
                <Container maxWidth="lg" className={cls.testContainer}>
                    <div className={cls.blockFinish}>
                        <div className={cls.blockStartInfoWrapper}>
                            <div className={cls.blockStartInfo}>
                                <span className={cls.blockFinishInfoLeft}>Оценка:</span>
                                <span className={cls.blockFinishInfoRight} style={{
                                    color: getColorByScore(testResult?.score || 1),
                                    fontWeight: 700
                                }}>{testResult.score}</span>
                            </div>
                            <div className={cls.blockStartInfo}>
                                <span className={cls.blockFinishInfoLeft}>Пройдено за:</span>
                                <span className={cls.blockFinishInfoRight}>{testResult.completionTime} мин</span>
                            </div>
                        </div>
                    </div>
                </Container>
            )

            if (testData?.deadline && testData.isResultVisibleAfterDeadline) {
                if (!testIsOpenByDate(testData.deadline)) {
                    console.log("open")
                    return resultBlock
                } else {
                    return (
                        <Container maxWidth="lg" className={cls.testContainer}>
                            <h2>Ваш результат отправлен преподавателю</h2>
                        </Container>
                    )

                }
            }
            return resultBlock
        }

        return (//(testSecondsLeft !== null &&
            <Container maxWidth="lg" className={classNames(cls.testContainer,{[cls.wrapperWithTimer]:!(testSecondsLeft !== null && !(testSecondsLeft > 0))},[])}>
            <div className={classNames(cls.testWrapper,{},[])} >
                {(testData.timeLimit !== 0) && !isComplete && <div
                    className={cls.testSecondLeftBlock}
                    style={(testSecondsLeft !== null && !(testSecondsLeft > 0) || testResult?.completedAt || "") ? {display: "none"} : {}}
                >

                        <IoMdTime size={32}  className={cls.iconTestSecondLeft}/>

                        <span className={cls.testSecondLeftTimer}>

                            {Math.floor((testSecondsLeft || 0) / 60)}:
                                {(testSecondsLeft || 0) % 60 < 10
                                    ? `0${(testSecondsLeft || 0) % 60}`
                                    : (testSecondsLeft || 0) % 60}
                        </span>
                        <span className={cls.testSecondLeftText}>мин</span>

                </div>}
                <div className={classNames(cls.quiz,{[cls.quizWithoutImage]:(testData.questions[currentQuestion].imageUrl !== undefined && testData.questions[currentQuestion].imageUrl !== '' && testData.questions[currentQuestion].imageUrl !== null),[cls.quizWithImage]:(testData.questions[currentQuestion].imageUrl === undefined ||  testData.questions[currentQuestion].imageUrl == '' ||  testData.questions[currentQuestion].imageUrl == null)},[])}>
                    <div className={cls["quiz-wrapper"]}>
                        {(testSecondsLeft !== null && !(testSecondsLeft > 0)) ? <h1>Время кончилось</h1> : <>
                            {(currentQuestion !== testData.questions.length) && !isComplete ? (
                                <>
                                {secondsLeft !== null && (
                                        <div className={classNames(cls["quiz-timer"], {}, [cls.quizIconBlock])}>
                                            <LuTimer size={32} className={cls.iconQuestionTimer}/>
                                            <span className={cls["question-count-text"]}>{secondsLeft}</span>
                                        </div>
                                    )}
                                    <div className={classNames(cls["quiz-question-count"], {}, [cls.quizIconBlock])}>
                                        <RiQuestionAnswerLine size={32} className={cls.iconQuestion}/>
                                        <span
                                            className={cls["question-count-text"]}>{currentQuestion + 1} из {testData.questions.length}</span>
                                    </div>
                                    <div className={cls.testInnerWrapper} style={{width: '100%'}}>
                                        <div className={cls["question-text-wrapper"]}>
                                            <h3 className={cls["question-text"]}>{testData.questions[currentQuestion].title1}</h3>
                                        </div>
                                        {testData.questions[currentQuestion]?.imageUrl && (
                                            <div className={cls.quizImageBlock}>
                                                <img src={testData.questions[currentQuestion].imageUrl || ""}
                                                     className={cls["quizImage"]}/>
                                            </div>
                                        )}

                                        {testData.questions[currentQuestion].type === "multiple-choice" ?
                                            <p
                                                className={cls.choiseTypeText}>Выберите несколько вариантов ответа</p> : testData.questions[currentQuestion].type === "single-choice" &&
                                            <p className={cls.choiseTypeText}>Выберите один вариант ответа</p>}
                                        {testData.questions[currentQuestion].type === "multiple-choice" || testData.questions[currentQuestion].type === "single-choice" ? (
                                            <div className={cls["quiz-questions"]}>
                                                {testData.questions[currentQuestion].options.map((option: string) => (
                                                    <button
                                                        key={option}
                                                        className={classNames(cls["quiz-question"], {
                                                            [cls.optionSelected]: selectedOptions.includes(option),
                                                        })}
                                                        onClick={() => {
                                                            if(testData.questions[currentQuestion].type === "multiple-choice"){
                                                                setSelectedOptions((prev) =>
                                                                    prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
                                                                )
                                                            } else {
                                                                setSelectedOptions((prev) =>
                                                                    prev.includes(option) ? prev.filter((o) => o !== option) : [ option]
                                                                )
                                                            }
                                                        }}
                                                        disabled={buttonsIsDisabled}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className={cls.shortAnswerBlock}>
                                                <Input placeholder={"Введите ответ"} className={cls.shortAnswerInput}
                                                       value={shortAnswerValue}
                                                       onChange={(value) => setShortAnswerValue(value)}/>
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
                            ) : <div>
                                {isComplete && (
                                    <h1>Ваша оценка:
                                        {/*@ts-ignore*/}
                                        {` ${testResult.score}`}
                                    </h1>
                                )
                                }
                            </div>}
                        </>}
                    </div>
                </div>
            </div>
            </Container>
        );
    }

    return <div></div>;
};

export default TestPage
