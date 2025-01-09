import { InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useCreateQuestionMutation } from "entities/Test/model/slice/testSlice";
import { ITest } from "entities/Test/model/types/test";
import React, { memo, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { createRandomizedQuestionsSets } from "shared/lib/shuffle/shuffle";
import { Button, ButtonTheme } from "shared/ui/Button/Button";
import { Input } from "shared/ui/Input/Input";
import { Text, TextSize } from "shared/ui/Text/Text";
import { TextArea } from "shared/ui/TextArea/TextArea";
import cls from './TestForm.module.scss';
import { InputTextSize, default as QuizFormInput, default as TestFormInput } from "./TestFormInput";

interface TestFormProps {
    className?: string;
    testData: ITest;
    refetchGetTest?: () => void;
    updateTestData: any;
    onChangeTestFormData: React.Dispatch<React.SetStateAction<ITest | undefined>>;
}

export const TestForm = memo((props: TestFormProps) => {
    const { className, testData, refetchGetTest, onChangeTestFormData, updateTestData } = props;
    const [createQuestion, { isLoading: createQuestionIsLoading }] = useCreateQuestionMutation();
    const [testFormData, setTestFormData] = useState<ITest>(testData);
    const [textAreaValue, setTextAreaValue] = useState('')
    useEffect(() => {
        setTestFormData(testData);
    }, [testData]);

    useEffect(() => {
        onChangeTestFormData(testFormData);
    }, [testFormData]);

    const createNewQuestion = async (title?: string | undefined, options?: string[] | undefined) => {
        //@ts-ignore
        setTestFormData((prevData) => {
            console.log(createRandomizedQuestionsSets(testFormData.questions.length + 1, testFormData.countRandomizedQuestionsSets));

            return {
                ...prevData,
                questions: [...prevData.questions, {
                    _id: (Math.random() * 5 * 100).toFixed(0),
                    test: testFormData._id,
                    title: title || "Вопрос №" + (testFormData.questions.length + 1),
                    title1: title || "Вопрос №" + (testFormData.questions.length + 1),
                    options: (options && options.length !== 0) ? options : [
                        "Вариант Ответа №1",
                        "Вариант Ответа №2",
                        "Вариант Ответа №3",
                        "Вариант Ответа №4",
                    ],
                    type: "multiple-choice",
                    shortAnswer: '',
                    isNewQuestion: true,
                    correctAnswers: [],
                    // correctAnswers: options || ["Вариант Ответа №1","Вариант Ответа №2"],

                }],
                randomizedQuestionsSets: prevData.isQuestionsRandomized ? createRandomizedQuestionsSets(testFormData.questions.length + 1, testFormData.countRandomizedQuestionsSets) : []
            }
        });
    };

    useEffect(() => {
        console.log(testFormData)
    }, [testFormData]);

    const handleTestNameChange = (name: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            name,
        }));
    };
    const handleTestDescriptionChange = (description: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            description,
        }));
    };

    const handleQuestionTypeChange = (questionId: string, type: "short-answer" | "multiple-choice" | "single-choice") => {
        setTestFormData((prevData) => {
            if (type === "short-answer") {
                return {
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q._id === questionId ? { ...q, type, options: [], correctAnswers: ["Ваш текстовый ответ"] } : q
                    ),
                }
            } else {
                return {
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q._id === questionId ? { ...q, type, correctAnswers: [] } : q
                    ),
                }
            }

        });
    };

    const handleQuestionTitleChange = (index: number, title: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q, i) =>
                i === index ? { ...q, title } : q // Обновляем только нужный вопрос
            ),
        }));
    };

    const handleTimeLimitChange = (questionTitle: string, timeLimit: number | undefined) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q.title === questionTitle
                    ? timeLimit === 0
                        ? { ...q, timeLimit: undefined } // Удаляем поле timeLimit
                        : { ...q, timeLimit } // Обновляем поле timeLimit
                    : q
            ),
        }));
    };

    console.log(testFormData);


    const handleOptionToggle = (questionTitle: string, option: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) => {
                if (q.title === questionTitle) {
                    const isChecked = q.correctAnswers.includes(option);
                    return {
                        ...q,
                        correctAnswers: isChecked
                            ? q.correctAnswers.filter((ans) => ans !== option)
                            : [...q.correctAnswers, option],
                    };
                }
                return q;
            }),
        }));
    };

    const handleOptionChange = (questionId: string, index: number, newOption: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) => {
                if (q.title === questionId) {
                    const updatedOptions = [...q.options];
                    updatedOptions[index] = newOption;
                    return { ...q, options: updatedOptions };
                }
                return q;
            }),
        }));
    };

    const handleDeleteOption = (questionTitle: string, index: number) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) => {
                if (q.title === questionTitle) {
                    return {
                        ...q,
                        options: q.options.filter((_, i) => i !== index),
                    };
                }
                return q;
            }),
        }));
    };

    const handleDeleteQuestion = (questionId: string) => {
        console.log(13);

        setTestFormData((prevData) => {
            let filteredQuestions = prevData.questions.filter((q) => q._id !== questionId)
            return {
                ...prevData,
                questions: prevData.questions.filter((q) => q._id !== questionId), randomizedQuestionsSets: prevData.isQuestionsRandomized ? createRandomizedQuestionsSets(testFormData.questions.length + 1, testFormData.countRandomizedQuestionsSets) : []
            }
        });
    };

    const handleAddOption = (questionTitle: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) => {
                if (q.title === questionTitle) {
                    return {
                        ...q,
                        options: [...q.options, `Новый вариант ответа ${q.options.length + 1}`],
                    };
                }
                return q;
            }),
        }));
    };

    const handleImageURLChange = (questionId: string, imageUrl: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q._id === questionId ? { ...q, imageUrl } : q
            ),
        }));
    };
    const handleShortAnswer = (questionId: string, shortAnswer: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q._id === questionId ? { ...q, shortAnswer: shortAnswer } : q
            ),
        }));
    };

    const handleImageURLChange1 = (questionTitle: string, qt: string, questionId: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q._id === questionId ? { ...q, title1: qt } : q
            ),
        }));
    };

    const handleSingleChoiceToggle = (questionTitle: string, option: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) => {
                if (q.title === questionTitle) {
                    return {
                        ...q,
                        correctAnswers: [option], // Устанавливаем единственный правильный ответ
                    };
                }
                return q;
            }),
        }));
    };



    return (
        <div className={cls.TestForm}>
            <div className={cls.TestFormBlock}>
                <TextField
                    value={testFormData?.name || ""}
                    onChange={(e) => {
                        handleTestNameChange(e.target.value);
                    }}
                    label='Название теста'
                    style={{ width: '100%' }}
                    variant="standard"
                />

                <TextField
                    value={testFormData?.description || ""}
                    onChange={(e) => {
                        handleTestDescriptionChange(e.target.value);
                    }}
                    className={cls.textareaDescription}
                    label="Описание теста"
                    multiline
                    rows={3}
                />
            </div>

            {testFormData.questions.map((question) => (
                <div key={question.title + question.type} className={cls.TestFormBlock}>
                    <TextField
                        className={cls.input}
                        value={question.title1 || ""}
                        onChange={(e) => {
                            handleImageURLChange1(question.title || "", e.target.value, question?._id || "");
                        }}
                        label={'Вопрос'}
                        style={{ width: '100%' }}
                        variant="standard"
                    />
                    <Select
                        value={question?.type}
                        onChange={(e: SelectChangeEvent<"short-answer" | "multiple-choice" | 'single-choice'>) => handleQuestionTypeChange(question._id || "", e.target.value as "short-answer" | "multiple-choice" | 'single-choice')}

                        className={cls.selectForm}
                        variant="outlined"
                    >
                        <MenuItem value="short-answer">Короткий ответ</MenuItem>
                        <MenuItem value="single-choice">Одиночный выбор</MenuItem>
                        <MenuItem value="multiple-choice">Множественный выбор</MenuItem>
                    </Select>

                    <div className={cls.TestFormIcons}>
                        <RiDeleteBinLine
                            className={cls.Icon}
                            title={"Удалить вопрос"}
                            onClick={() => {
                                handleDeleteQuestion(question._id || "")
                            }}
                        />
                    </div>

                    <div className={cls.settings}>
                        {question.type === 'multiple-choice' ? <div className={cls.AnswerOptions}>
                            {question.options.map((option, index) => (
                                <div className={cls.multiChoice}>        <label className={cls.AnswerOptionLabel} key={index}>
                                    <input
                                        type="checkbox"
                                        name={`question-${question._id}`}
                                        value={option}
                                        checked={question.correctAnswers.includes(option)}
                                        onChange={() => handleOptionToggle(question.title || "", option)}
                                        className={cls.AnswerOptionRadio}
                                    />

                                </label>
                                    <TextField
                                        value={option}
                                        onChange={(e) =>
                                            handleOptionChange(question.title || "", index, e.target.value)
                                        }
                                        variant={"standard"}
                                    />
                                    <IoIosClose
                                        className={cls.Icon}
                                        title={"Удалить вариант ответа"}
                                        onClick={() => handleDeleteOption(question.title || "", index)}
                                    />
                                </div>
                            ))}

                            <button
                                className={cls.AddAnswerOption}
                                onClick={() => handleAddOption(question.title || "")}
                            >
                                + Добавить вариант ответа
                            </button>
                        </div> : question.type === 'short-answer' ? <>
                            {/* {question.correctAnswers.map((correctAnswer, index) => (
                                <div className={cls.shortAnswerBlock}>
                                    <TextField
                                        className={cls.shortAnswerInput}
                                        value={correctAnswer}
                                        onChange={(e) =>
                                            handleShortAnswer(question._id || "", e.target.value)
                                        }
                                        placeholder={"Текстовый ответ"}
                                        label={"Текстовый ответ"}
                                        variant={"standard"}
                                    /></div>
                            ))} */}
                            <TextField
                                className={cls.shortAnswerInput}
                                value={question.shortAnswer}
                                onChange={(e) =>
                                    handleShortAnswer(question._id || "", e.target.value)
                                }
                                placeholder={"Текстовый ответ"}
                                label={"Текстовый ответ"}
                                variant={"standard"}
                            />
                        </> : question.type === 'single-choice' && (
                            <div className={cls.AnswerOptions}>
                                {question.options.map((option, index) => (
                                    <div className={cls.singleChoice} key={index}>
                                        <label className={cls.AnswerOptionLabel}>
                                            <input
                                                type="radio"
                                                name={`question-${question.title}`}
                                                value={option}
                                                checked={question.correctAnswers[0] === option}
                                                onChange={() => handleSingleChoiceToggle(question.title || "", option)}
                                                className={cls.AnswerOptionRadio}
                                            />
                                        </label>
                                        <TextField
                                            value={option}
                                            onChange={(e) =>
                                                handleOptionChange(question.title || "", index, e.target.value)
                                            }
                                            variant={"standard"}
                                        />
                                        <IoIosClose
                                            className={cls.Icon}
                                            title={"Удалить вариант ответа"}
                                            onClick={() => handleDeleteOption(question.title || "", index)}
                                        />
                                    </div>
                                ))}

                                <button
                                    className={cls.AddAnswerOption}
                                    onClick={() => handleAddOption(question.title || "")}
                                >
                                    + Добавить вариант ответа
                                </button>
                            </div>
                        )}

                        <div className={cls.QuestionSettings}>
                            <TextField
                                className={cls.input}
                                value={question.timeLimit !== 0 && question.timeLimit !== null && question.timeLimit !== undefined ? question.timeLimit : ""}
                                type={"number"}
                                onChange={(e) =>
                                    handleTimeLimitChange(question.title || "", Number(e.target.value))
                                }
                                placeholder="Укажите время выполнения"
                                label="Время выполнения (сек)"
                                variant="standard"
                            />

                            <TextField
                                className={cls.input}
                                type={"url"}
                                value={question.imageUrl}
                                onChange={(e) =>
                                    handleImageURLChange(question._id || "", e.target.value)
                                }
                                placeholder={"Укажите ссылку на изображение"}
                                label={"Ссылка на изображение"}
                                variant={"standard"}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <TextArea
                className={cls.textareaNewQuestion}
                onChange={(value) => setTextAreaValue(value)} value={textAreaValue} placeholder="Вставьте ваш вопрос с вариантами ответа (пример)
                ⠀
                Кто создал Linux?¶
                     Ада Лавлейс ¶
                     Алан Тьюринг¶
                     Линус Торвальдс¶
                "/>

            <Button
                className={cls.AddQuestion}
                onClick={() => {
                    const splitedValue = textAreaValue.split('\n')
                    let title = splitedValue[0]
                    splitedValue.shift()
                    createNewQuestion(title, splitedValue)
                    setTextAreaValue('')
                }}
                disabled={createQuestionIsLoading}
                theme={ButtonTheme.BACKGROUND}
            >
                + Добавить новый вопрос
            </Button>

        </div>
    );
});
