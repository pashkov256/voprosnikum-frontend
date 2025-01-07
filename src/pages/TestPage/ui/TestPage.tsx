import { RootState } from 'app/providers/StoreProvider/config/store';
import {
    useCreateTestAnswerMutation,
    useCreateTestResultMutation,
    useGetTestByIdQuery,
    useGetTestResultQuery,
    useUpdateTestResultMutation
} from 'entities/Test/model/slice/testSlice';
import { IQuestion } from 'entities/Test/model/types/test';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { formatTimeDifference } from 'shared/lib/date';
import isPastDate from 'shared/lib/isPastDate/isPastDate';
import { shuffle } from 'shared/lib/shuffle/shuffle';
import Loader from 'shared/ui/Loader/Loader';
import { Test } from './Test';
import { TestResult } from './TestResult';
import { TestStart } from './TestStart';
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
    const { data: testData, isLoading: testDataIsLoading } = useGetTestByIdQuery({ _id: testId || "", mode: "student" }); // Получение данных теста
    const { data: testResult, isLoading: testResultIsLoading, refetch: refetchTestResult } = useGetTestResultQuery({ test: testId || "", student: userData?._id || "" });//получение результата теста
    const [createTestResult] = useCreateTestResultMutation(); // Создание результата теста
    const [createTestAnswer] = useCreateTestAnswerMutation(); // Создание ответа на вопрос
    const [updateTestResult] = useUpdateTestResultMutation()//обновление результата теста
    const currentQuestionData = (testResult && testData?.randomizedQuestionsSets?.length !== 0 && testData?.isQuestionsRandomized) ? testData?.questions[testData?.randomizedQuestionsSets[testResult?.randomizedQuestionsSetIndex][currentQuestion]] : testData?.questions[currentQuestion];


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

        // Проверяем актуальность теста
        const isTestExpired = testData?.deadline && !isPastDate(testData.deadline);
        if (isTestExpired && !testData.isResultVisibleAfterDeadline) {
            alert("Тест не актуален");
            navigate('/');
            return;
        }

        // Если результат теста существует
        if (testResult) {
            if (testResult.completedAt) {
                // Если тест уже завершён
                setIsComplete(true);
                return;
            } else {
                const newCurrentQuestion = (testResult.testAnswers?.length || 0)
                if (testResult.testAnswers?.length !== 0) {
                    setCurrentQuestion(newCurrentQuestion); // Вернуться на последний незавершённый вопрос
                }
                setStartTest(true);
                initialTestTimer();
                setupTimerForCurrentQuestion(newCurrentQuestion);

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
            if (testData) {
                alert('Время на вопрос кончилось')
                setQuestionSecondsLeft(null)//обнуление состояние таймера вопроса
                setButtonsIsDisabled(true);
                createTestAnswer({ testResult: testResult?._id || "", question: (currentQuestionData || testData.questions[currentQuestion])?._id || "", isCorrect: false, isTimeFail: true, questionType: currentQuestionData?.type || 'single-choice' })
                // createTestAnswer({ testResult: testResult?._id || "", question: testData.questions[currentQuestion]._id, isCorrect: false, isTimeFail: true })
                if (currentQuestion + 1 >= testData.questions.length) {
                    finalizeTest()
                } else {
                    setCurrentQuestion((prev) => {
                        setupTimerForCurrentQuestion(prev + 1)
                        return prev + 1
                    })
                }
                setButtonsIsDisabled(false);
            }
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
        console.log(testData);


        let currentQuestionForTimer = currentQuestionProps !== undefined ? currentQuestionProps : currentQuestion
        if (!testData || !(currentQuestionData || testData.questions[currentQuestionForTimer])) return;
        // !if (!testData || !testData.questions[currentQuestionForTimer]) return;
        const questionTimeLimit = (testData?.randomizedQuestionsSets.length !== 0 && testData.isQuestionsRandomized) ? testData?.questions[testData?.randomizedQuestionsSets[testResult?.randomizedQuestionsSetIndex || 0][currentQuestionForTimer === 0 ? 0 : currentQuestionForTimer]]?.timeLimit : testData.questions[currentQuestionForTimer === 0 ? 0 : currentQuestionForTimer]?.timeLimit;
        console.log({ questionTimeLimit });

        console.log({ currentQuestionForTimer });






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



    const handleNextQuestion = useCallback(async () => {
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

                // if (question.type === 'short-answer') {
                //     // answerPayload.isCorrect = shortAnswerValue === question.correctAnswers[0];
                //     // answerPayload.short
                // } else if (question.type === 'multiple-choice') {
                //     answerPayload.selectedAnswerOptions = selectedOptions;
                //     answerPayload.correctAnswers = question.correctAnswers;
                // } else if (question.type === 'single-choice') {
                //     answerPayload.isCorrect = selectedOptions.includes(question.correctAnswers[0]);
                // }
                console.log(answerPayload);

                await createTestAnswer(answerPayload);

                // Очистка данных после отправки ответа
                setSelectedOptions([]);
                setShortAnswerValue('');

                // Переход к следующему вопросу или завершение теста
                if (currentQuestion + 1 === testData.questions.length) {
                    finalizeTest()
                } else {
                    setCurrentQuestion((prev) => {
                        console.log(`prev + 1 ${prev + 1}`);

                        setupTimerForCurrentQuestion(prev + 1)
                        return prev + 1
                    });

                }
            } catch (error) {
                console.error('Error submitting answer:', error);
            }
        }

    }, [currentQuestion, selectedOptions, shortAnswerValue, testData]);


    useEffect(() => {
        if (!testDataIsLoading && !testResultIsLoading) {
            setupTest();
        }
    }, [testData, testResult]);

    if ((testResultIsLoading || testDataIsLoading) && !testData) {
        return <Loader />;
    }

    if (!testData) {
        return <h1>Тест не найден</h1>;
    }

    if (!startTest && !isComplete) {
        return <TestStart testData={testData} onStartTest={handleStartTest} />;
    }

    if (isComplete && testResult && !testResultIsLoading) {
        return <TestResult testResult={testResult} />;
    }

    return (
        <Test
            testData={testData}
            currentQuestion={currentQuestion}
            currentQuestionData={currentQuestionData || testData.questions[currentQuestion]}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            handleNextQuestion={handleNextQuestion}
            shortAnswerValue={shortAnswerValue}
            setShortAnswerValue={setShortAnswerValue}
            testSecondsLeft={testSecondsLeft}
            questionSecondsLeft={questionSecondsLeft}
            buttonsIsDisabled={buttonsIsDisabled}
            isComplete={isComplete}
        />
    );
};

export default TestPage;
