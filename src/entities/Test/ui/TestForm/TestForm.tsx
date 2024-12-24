import React, { memo, useEffect, useState } from "react";
import cls from './TestForm.module.scss';
import QuizFormInput, { InputTextSize } from "./TestFormInput";
import {TextField, Select, MenuItem, SelectChangeEvent} from "@mui/material";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { ITest } from "entities/Test/model/types/test";
import { useCreateQuestionMutation } from "entities/Test/model/slice/testSlice";
import TestFormInput from "./TestFormInput";
interface TestFormProps {
    className?: string;
    testData: ITest;
    refetchGetTest?: () => void;
    updateTestData: any;
    onChangeTestFormData:  React.Dispatch<React.SetStateAction<ITest | undefined>>;
}

export const TestForm = memo((props: TestFormProps) => {
    const { className, testData, refetchGetTest ,onChangeTestFormData,updateTestData} = props;
    const [createQuestion, { isLoading: createQuestionIsLoading }] = useCreateQuestionMutation();
    const [testFormData, setTestFormData] = useState<ITest>(testData);
    const [textAreaValue,setTextAreaValue] = useState('')
    useEffect(() => {
        setTestFormData(testData);
    }, [testData]);

    useEffect(() => {
        onChangeTestFormData(testFormData);
    }, [testFormData]);

    const createNewQuestion = async (title?:string | undefined,options?:string[] | undefined) => {
        //@ts-ignore
        await updateTestData({...testFormData});
        console.log({...testFormData})
        await createQuestion({
            test: testFormData._id,
            title: title || "Нажмите чтобы изменить вопрос №" + (testFormData.questions.length + 1),
            title1: title || "Нажмите чтобы изменить вопрос №" + (testFormData.questions.length + 1),
            options: (options && options.length !== 0) ? options : [
                "Вариант Ответа №1",
                "Вариант Ответа №2",
                "Вариант Ответа №3",
                "Вариант Ответа №4",
            ],
            type: "multiple-choice",
            //@ts-ignore
            correctAnswers: options[0] || ["Вариант Ответа №1"],
        });
        refetchGetTest?.();
    };

    useEffect(() => {
        console.log(`testFormData ${testFormData}`)
        console.log(testFormData)
    }, [testFormData]);

    const handleTestNameChange = (name: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            name,
        }));
    };

    const handleQuestionTypeChange = (questionId: string, type: "short-answer" | "multiple-choice" | "single-choice") => {
        setTestFormData((prevData) => {
            if(type === "short-answer"){
                return {
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q._id === questionId ? { ...q, type, options:[] ,correctAnswers: ["Ваш текстовый ответ"]} : q
                    ),
                }
            } else if(type === 'multiple-choice'){
                return {
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q._id === questionId ? { ...q, type, options: [
                                "Вариант Ответа №1",
                                "Вариант Ответа №2",
                                "Вариант Ответа №3",
                                "Вариант Ответа №4",
                            ], correctAnswers: ["Вариант Ответа №1"] } : q
                    ),
                }
            } else {
                return {
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q._id === questionId ? { ...q, type } : q
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

    const handleTimeLimitChange = (questionTitle: string, timeLimit: number) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q.title === questionTitle ? { ...q, timeLimit } : q
            ),
        }));
    };

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
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.filter((q) => q._id !== questionId),
        }));
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
                q._id === questionId ? { ...q, correctAnswers:[shortAnswer] } : q
            ),
        }));
    };

    const handleImageURLChange1 = (questionTitle: string, imageUrl: string) => {
        setTestFormData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q.title === questionTitle ? { ...q, title1: imageUrl} : q
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
                <QuizFormInput
                    value={testFormData?.name || ""}
                    onChange={handleTestNameChange}
                    textSize={InputTextSize.XL}
                    placeholder={'Название теста'}
                    style={{ width: '100%' }}
                />
            </div>

            {testFormData.questions.map((question) => (
                <div key={question.title + question.type} className={cls.TestFormBlock}>
                    <TestFormInput
                        className={cls.input}
                        value={question.title1 || "" }
                        onChange={(e) =>
                            handleImageURLChange1(question.title || "", e)
                        }
                        style={{ width: '100%', fontSize: "18px" }}
                        placeholder={"Введите заголовок вопроса"}
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
                            {question.type === 'multiple-choice' ?  <div className={cls.AnswerOptions}>
                                {question.options.map((option, index) => (
                                    <div className={cls.multiChoice}>        <label className={cls.AnswerOptionLabel} key={index}>
                                        <input
                                            type="checkbox"
                                            name={`question-${question.title}`}
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
                                        /></div>
                                ))}

                                <button
                                    className={cls.AddAnswerOption}
                                    onClick={() => handleAddOption(question.title || "")}
                                >
                                    + Добавить вариант ответа
                                </button>
                            </div> : question.type === 'short-answer' ?  <>
                                {question.correctAnswers.map((correctAnswer, index) => (
                                    <div className={cls.shortAnswerBlock}>
                                        <TextField
                                            className={cls.shortAnswerInput}
                                            value={correctAnswer}
                                            onChange={(e) =>
                                                handleShortAnswer(question._id || "", e.target.value)
                                            }
                                            placeholder={"Текстовый ответ"}
                                            variant={"standard"}
                                        /></div>
                                ))}
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
                                value={question.timeLimit}
                                type={"number"}
                                onChange={(e) =>
                                    handleTimeLimitChange(question.title || "", Number(e.target.value))
                                }
                                placeholder="Время выполнения (сек)"
                                variant="standard"
                            />

                            <TextField
                                className={cls.input}
                                type={"url"}
                                value={question.imageUrl}
                                onChange={(e) =>
                                    handleImageURLChange(question._id || "", e.target.value)
                                }
                                placeholder={"Ссылка на изображение"}
                                variant={"standard"}
                            />
                        </div>
                    </div>
                </div>
            ))}




                <textarea className={cls.textarea} value={textAreaValue} onChange={(e)=>setTextAreaValue(e.target.value)} placeholder="Вставьте ваш вопрос с вариантами ответа (пример)
                ⠀
                Кто создал Linux?¶
                     Ада Лавлейс ¶
                     Алан Тьюринг¶
                     Линус Торвальдс¶
                "></textarea>



                <button
                    className={cls.AddQuestion}
                    onClick={()=>{
                        const splitedValue = textAreaValue.split('\n')
                        let title = splitedValue[0]
                        splitedValue.shift()
                        createNewQuestion(title,splitedValue)
                        setTextAreaValue('')
                    }}
                    disabled={createQuestionIsLoading}
                >
                    + Добавить новый вопрос
                </button>

        </div>
    );
});
