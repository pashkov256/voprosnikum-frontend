import { RootState } from 'app/providers/StoreProvider/config/store';
import {
    useCreateTestAnswerMutation,
    useCreateTestResultMutation,
    useGetTestByIdQuery,
    useGetTestResultQuery,
    useUpdateTestAnswerMutation,
    useUpdateTestResultMutation
} from 'entities/Test/model/slice/testSlice';
import { IQuestion } from 'entities/Test/model/types/test';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import {formatDate, formatTimeDifference} from 'shared/lib/date';
import isPastDate from 'shared/lib/isPastDate/isPastDate';
import { shuffle } from 'shared/lib/shuffle/shuffle';
import Loader from 'shared/ui/Loader/Loader';
import { Test } from './Test';
import { TestResult } from './TestResult';
import { TestStart } from './TestStart';
import {isTestAvailable} from "shared/lib/date/isTestAvailable";
const TestPage = () => {
    const { testId } = useParams(); // Получаем ID теста из URL
    const navigate = useNavigate();
    const userData = useSelector((state: RootState) => state.auth.data)
    const [startTest, setStartTest] = useState(false); // Начат ли тест
    const [currentQuestion, setCurrentQuestion] = useState(0); // Индекс текущего вопроса
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // Выбранные пользователем ответы
    const [shortAnswerValue, setShortAnswerValue] = useState(''); // Значение для короткого ответа
    const [testSecondsLeft, setTestSecondsLeft] = useState<number | null>(null); // Секунды, оставшиеся на тест
    const [isComplete, setIsComplete] = useState(false); // Завершен ли тест
    const [questionSecondsLeft, setQuestionSecondsLeft] = useState<number | null>(null); // Таймер на текущий ВОПРОС теста
    const [buttonsIsDisabled, setButtonsIsDisabled] = useState(false);
    const [inputIsDisabled, setInputIsDisabled] = useState(false);
    const { data: testData, isLoading: testDataIsLoading } = useGetTestByIdQuery({ _id: testId || "", mode: "student" }); // Получение данных теста
    const { data: testResult, isLoading: testResultIsLoading, refetch: refetchTestResult } = useGetTestResultQuery({ test: testId || "", student: userData?._id || "" });//получение результата теста
    const [createTestResult] = useCreateTestResultMutation(); // Создание результата теста
    const [createTestAnswer] = useCreateTestAnswerMutation(); // Создание ответа на вопрос
    const [updateTestResult] = useUpdateTestResultMutation()//обновление результата теста
    const [updateTestAnswer] = useUpdateTestAnswerMutation()//обновление ответа на вопрос
    const isBackMode = (testResult?.testAnswers?.length || 0) > currentQuestion
    const currentQuestionData = (testResult && testData?.randomizedQuestionsSets?.length !== 0 && testData?.isQuestionsRandomized) ? testData?.questions[testData?.randomizedQuestionsSets[testResult?.randomizedQuestionsSetIndex][currentQuestion]] : testData?.questions[currentQuestion];
    const [focusLossCount, setFocusLossCount] = useState(testResult?.focusLossCount || 0);
    const handleStartTest = async () => {//старт теста по клику
        try {
            const newDateStart = new Date().toISOString()
            //@ts-ignore
            await createTestResult({ test: testId, student: userData._id, dateStart: newDateStart, randomizedQuestionsSetIndex: Math.floor(Math.random() * testData?.randomizedQuestionsSets.length) });
            await refetchTestResult()
            setStartTest(true);
            initialTestTimer(newDateStart)
            setupTimerForCurrentQuestion()
        } catch (error) {
            console.error('Error creating test result:', error);
        }
    };


    const setupTest = async () => {
        if (!testData) return;
        document.title = testData.name;

        if(testData?.startDate){
            if(!isTestAvailable(testData?.startDate || "")){
                alert(`Тест доступен с ${formatDate(testData?.startDate || "")}, на данный момент тест не доступен`);
                navigate('/');
            }
        }

        // Проверяем актуальность теста
        const isTestExpired = testData?.deadline && !isPastDate(testData.deadline);
        if (isTestExpired && !testData.isResultVisibleAfterDeadline) {
            alert("Тест не актуален");
            navigate('/');
            return;
        }
        console.log({testResult})
        // Если результат теста существует
        if (testResult) {

            if (testResult.completedAt) {
                // Если тест уже завершён
                setIsComplete(true);
                return;
            } else {
                if (!(testResult.testAnswers?.length >= testData.questions.length)) {
                    const newCurrentQuestion = (testResult.testAnswers?.length || 0)
                    if (testResult.testAnswers?.length !== 0) {
                        setCurrentQuestion(newCurrentQuestion); // Вернуться на последний незавершённый вопрос

                    }
                    setStartTest(true);
                    initialTestTimer();
                    setupTimerForCurrentQuestion(newCurrentQuestion);
                } else {
                    finalizeTest()
                }

            }
        } else {
            // Если тест начат, но без сохранённых данных
            if (startTest) {
                initialTestTimer();
                setupTimerForCurrentQuestion();
            }
        }
    };

    useEffect(() => {
        if (questionSecondsLeft === null) return;
        if (questionSecondsLeft > 0) {
            const timer = setTimeout(() => setQuestionSecondsLeft(questionSecondsLeft - 1), 1000);//таймер на вопрос, если в текущем вопросе есть лимит по времени
            return () => clearTimeout(timer);
        } else {
            let kostil = async () => {
                if (testData) {
                    alert('Время на вопрос кончилось')
                    setQuestionSecondsLeft(null)//обнуление состояние таймера вопроса
                    setButtonsIsDisabled(true);
                    setInputIsDisabled(true);
                    await createTestAnswer({ testResult: testResult?._id || "", question: (currentQuestionData || testData.questions[currentQuestion])?._id || "", isCorrect: false, isTimeFail: true, questionType: currentQuestionData?.type || 'single-choice' })

                    if (currentQuestion + 1 >= testData.questions.length) {
                        finalizeTest()
                    } else {
                        setCurrentQuestion((prev) => {
                            setupTimerForCurrentQuestion(prev + 1)
                            return prev + 1
                        })

                    }
                    await refetchTestResult()
                    setButtonsIsDisabled(false);
                    setInputIsDisabled(false);
                }
            }
            kostil()
        }
    }, [questionSecondsLeft]);

    useEffect(() => {
        if (testSecondsLeft === null) return;
        if (testSecondsLeft !== null && testSecondsLeft > 0) {
            const timer = setInterval(() => setTestSecondsLeft((prev) => (prev || 1) - 1), 1000);
            return () => clearInterval(timer);
        } else if (testSecondsLeft === 0) {
            alert("Увы, но время на тест кончилось!!!")
            finalizeTest()
        }
    }, [testSecondsLeft]);

    const initialTestTimer = (dateStart?: string) => {//функция для установления таймера на весь тест
        if (testData?.timeLimit) {
            let startDate: number = 0
            if (dateStart) {
                startDate = new Date(dateStart).getTime();
            }
            if (testResult?.dateStart) {
                startDate = new Date(testResult?.dateStart || "").getTime();
            }
            const now = new Date().getTime();
            const totalTime = testData.timeLimit * 60; // Время в секундах
            const elapsedTime = Math.floor((now - startDate) / 1000);
            const remainingTime = totalTime - elapsedTime;//получаем сколько времени осталось от даты начала теста и времени лимита на тест
            setTestSecondsLeft(remainingTime > 0 ? remainingTime : 0);
        }
    }


    const setupTimerForCurrentQuestion = async (currentQuestionProps?: number) => {
        let currentQuestionForTimer = currentQuestionProps !== undefined ? currentQuestionProps : currentQuestion

        if (!testData || !(currentQuestionData || testData.questions[currentQuestionForTimer])) return;

        const questionTimeLimit = (testData?.randomizedQuestionsSets.length !== 0 && testData.isQuestionsRandomized) ? testData?.questions[testData?.randomizedQuestionsSets[testResult?.randomizedQuestionsSetIndex || 0][currentQuestionForTimer === 0 ? 0 : currentQuestionForTimer]]?.timeLimit : testData.questions[currentQuestionForTimer === 0 ? 0 : currentQuestionForTimer]?.timeLimit;

        if (questionTimeLimit !== undefined) {
            //@ts-ignore
            setQuestionSecondsLeft(questionTimeLimit); // Устанавливаем таймер на текущий вопрос
        }

        // Если последний вопрос или тест завершён
        if (currentQuestion >= testData.questions.length || isComplete) {
            await refetchTestResult()
            finalizeTest();
        }
    };

    const finalizeTest = async () => {
        const completedAt = new Date().toISOString();
        const completionTime = formatTimeDifference(testResult?.dateStart || "", completedAt);

        await updateTestResult({
            id: testResult?._id || "",
            completedAt,
            completionTime,
        });
        await refetchTestResult()

        setIsComplete(true);
        setTestSecondsLeft(null); // Сбрасываем таймер на тест
        setQuestionSecondsLeft(null)
    };

    useEffect(() => {
        if (isBackMode && testResult) {
            if (currentQuestionData?.type === 'multiple-choice' || currentQuestionData?.type === 'single-choice') {
                if (currentQuestionData.timeLimit !== undefined) {
                    setButtonsIsDisabled(true)
                }
                setSelectedOptions(testResult.testAnswers[currentQuestion].selectedOptions)
            } else if (currentQuestionData?.type === 'short-answer') {
                if (currentQuestionData.timeLimit !== undefined) {
                    setInputIsDisabled(true)
                }
                setShortAnswerValue(testResult.testAnswers[currentQuestion].shortAnswer)
            }
        }
    }, [currentQuestion])

    const haveSelectedOptionsChanged = () => {
        if (testResult?.testAnswers[currentQuestion]?.isTimeFail === true) {
            return false
        }
        if (testResult && (currentQuestionData?.type === 'multiple-choice' || currentQuestionData?.type === 'single-choice')) {
            const currentTestAnswerData = testResult?.testAnswers[currentQuestion]
            if (isBackMode) {
                // Проверяем разницу в длине массивов
                if (selectedOptions.length !== currentTestAnswerData?.selectedOptions.length) {
                    return true;
                }

                // Проверяем, содержатся ли все элементы одного массива в другом
                for (const option of selectedOptions) {
                    if (!currentTestAnswerData?.selectedOptions.includes(option)) {
                        return true;
                    }
                }

                for (const option of currentTestAnswerData?.selectedOptions) {
                    if (!selectedOptions.includes(option)) {
                        return true;
                    }
                }

                return false; // Если длина и содержимое массивов одинаковы
            } else {
                return false;
            }
        }
        return false;
    };


    const handleNextQuestion = async () => {
        if (isBackMode) {
            if ((haveSelectedOptionsChanged() || shortAnswerValue !== testResult?.testAnswers[currentQuestion]?.shortAnswer)) {
                let answerUpdatePayload: {
                    testResult: string;
                    shortAnswer?: string;
                    selectedOptions?: string[];
                    testAnswerId: string;
                    pointsAwarded: number
                } = { testResult: testResult?._id || "", testAnswerId: testResult?.testAnswers[currentQuestion]._id || "", pointsAwarded: testResult?.testAnswers[currentQuestion].pointsAwarded || 0 }
                if (currentQuestionData?.type === 'multiple-choice' || currentQuestionData?.type === 'single-choice') {
                    answerUpdatePayload = { ...answerUpdatePayload, selectedOptions }
                } else if (currentQuestionData?.type === 'short-answer') {
                    answerUpdatePayload = { ...answerUpdatePayload, shortAnswer: shortAnswerValue }
                    setShortAnswerValue('')
                }

                await updateTestAnswer(answerUpdatePayload)
                await refetchTestResult()
                setShortAnswerValue('')
                setSelectedOptions([])
            }

            if (currentQuestionData?.timeLimit !== undefined) {
                setButtonsIsDisabled(false);
                setInputIsDisabled(false);
            }
            setCurrentQuestion((prev) => prev + 1)
        } else {
            if ((selectedOptions.length !== 0 && (currentQuestionData?.type === 'multiple-choice') || (currentQuestionData?.type === 'single-choice')) || (shortAnswerValue !== "" && currentQuestionData?.type === 'short-answer')) {
                setQuestionSecondsLeft(null)
                if (testData) {
                    const question = currentQuestionData || testData.questions[currentQuestion];

                    // Отправка ответа
                    try {
                        const answerPayload: {
                            testResult: string,
                            question: string,
                            isCorrect?: boolean,
                            correctAnswers?: string[],
                            selectedAnswerOptions?: string[],
                            isTimeFail?: boolean,
                            questionType: IQuestion['type'],
                            shortAnswer: string;
                            selectedOptions: string[];
                        } = {
                            testResult: testResult?._id || "",
                            question: question?._id || "",
                            questionType: question.type,
                            shortAnswer: shortAnswerValue,
                            selectedOptions: selectedOptions
                        }

                        await createTestAnswer(answerPayload);
                        await refetchTestResult()
                        // Очистка данных после отправки ответа
                        setSelectedOptions([]);
                        setShortAnswerValue('');

                        // Переход к следующему вопросу или завершение теста
                        if (currentQuestion + 1 === testData.questions.length) {
                            finalizeTest()
                        } else {
                            setCurrentQuestion((prev) => {
                                setupTimerForCurrentQuestion(prev + 1)
                                return prev + 1
                            });

                        }
                    } catch (error) {
                        console.error('Error submitting answer:', error);
                    }
                }
            } else {
                alert('Укажите ответ!')
            }
        }
        setShortAnswerValue('')
        setSelectedOptions([])
        setButtonsIsDisabled(false);
        setInputIsDisabled(false);
    };
    const handleToPrevQuestion = () => {
        if (!((questionSecondsLeft || 0) > 0)) {
            if ((haveSelectedOptionsChanged() || (shortAnswerValue || "") !== (testResult?.testAnswers[currentQuestion]?.shortAnswer || "")) && isBackMode) {
                alert('Сохраните изменения')
            } else {
                if (currentQuestion >= 1) {

                    setCurrentQuestion((prev) => prev - 1)
                    const currentTestAnswerData = testResult?.testAnswers[currentQuestion - 1]
                    setSelectedOptions(currentTestAnswerData?.selectedOptions || [])
                    setShortAnswerValue(currentTestAnswerData?.shortAnswer || '')
                    setButtonsIsDisabled(false);
                    setInputIsDisabled(false);
                }
            }
        }
    }

    useEffect(() => {
        const handleBlur = async () => {
            setFocusLossCount((prev) => prev + 1);
            try {
                if (!isComplete) {
                    await updateTestResult({
                        id: testResult?._id || "", // Используем постоянный testResult._id
                        focusLossCount: focusLossCount + 1,
                    });
                }
            } catch (error) {
                console.error("Ошибка при обновлении на сервере:", error);
            }
        };
        window.addEventListener("blur", handleBlur);
        return () => {
            window.removeEventListener("blur", handleBlur);
        };
    }, [focusLossCount, testResult]);
    useEffect(() => {
        if (testResult) {
            setFocusLossCount(testResult.focusLossCount)
            if(testResult.completedAt){
                setIsComplete(true)
            }
        }
    }, [testResult])

    useEffect(() => {
        if (!testDataIsLoading && !testResultIsLoading) {
            setupTest();
        }
    }, [testData]);

    if ((testResultIsLoading || testDataIsLoading) && !testData) {
        return <Loader />;
    }
    console.log({testData,isComplete,testResult,testResultIsLoading,testDataIsLoading});

    if (!testData) {
        return <h1>Тест не найден</h1>;
    }

    if (!startTest && !isComplete && !testResult) {
        return <TestStart testData={testData} onStartTest={handleStartTest} />;
    }

    if (isComplete && testResult && !testResultIsLoading) {
        return <TestResult testResult={testResult} />;
    }

    if(!isComplete && !testResultIsLoading){
        return <Test
            testData={testData}
            testResult={testResult}
            currentQuestion={currentQuestion}
            currentQuestionData={currentQuestionData || testData.questions[currentQuestion]}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            setButtonsIsDisabled={setButtonsIsDisabled}
            handleNextQuestion={handleNextQuestion}
            handleToPrevQuestion={handleToPrevQuestion}
            haveSelectedOptionsChanged={haveSelectedOptionsChanged}
            shortAnswerValue={shortAnswerValue}
            setShortAnswerValue={setShortAnswerValue}
            testSecondsLeft={testSecondsLeft}
            questionSecondsLeft={questionSecondsLeft}
            buttonsIsDisabled={buttonsIsDisabled}
            inputIsDisabled={inputIsDisabled}
            isComplete={isComplete}
            isBackMode={isBackMode}
        />
    } else {
        return <div></div>
    }
};

export default TestPage;
