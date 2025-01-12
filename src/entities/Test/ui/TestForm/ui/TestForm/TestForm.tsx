import React, {memo, useCallback, useState} from "react";
import {TextField} from "@mui/material";
import {useCreateQuestionMutation} from "entities/Test/model/slice/testSlice";
import {IQuestion, ITest} from "entities/Test/model/types/test";
import {createRandomizedQuestionsSets} from "shared/lib/shuffle/shuffle";
import {Button, ButtonTheme} from "shared/ui/Button/Button";
import {TextArea} from "shared/ui/TextArea/TextArea";
import {QuestionEdit} from "../QuestionEdit/QuestionEdit";
import cls from 'entities/Test/ui/TestForm/ui/TestForm/TestForm.module.scss';
import {classNames} from "shared/lib/classNames/classNames";
import { IoAddCircleOutline } from "react-icons/io5";
interface TestFormProps {
    className?: string;
    testData: ITest;
    refetchGetTest?: () => void;
    updateTestData: any;
    onChangeTestFormData: React.Dispatch<React.SetStateAction<ITest>>;
}

interface TestFormProps {
    className?: string;
    testData: ITest;
    refetchGetTest?: () => void;
    updateTestData: any;
    onChangeTestFormData: React.Dispatch<React.SetStateAction<ITest>>; // Убрали undefined
}
export const TestForm = memo((props: TestFormProps) => {
    const { className, testData, refetchGetTest, onChangeTestFormData, updateTestData } = props;
    const [createQuestion, { isLoading: createQuestionIsLoading }] = useCreateQuestionMutation();
    const [textAreaValue, setTextAreaValue] = useState('');

    const handleTestNameChange = useCallback((name: string) => {
        onChangeTestFormData((prev) => ({ ...prev, name }));
    }, [onChangeTestFormData]);

    const handleTestDescriptionChange = useCallback((description: string) => {
        onChangeTestFormData((prev) => ({ ...prev, description }));
    }, [onChangeTestFormData]);

    const handleQuestionChange = useCallback((questionId: string, field: string, value: any) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q._id === questionId ? { ...q, [field]: value } : q
            ),
        }));
    }, [onChangeTestFormData]);

    const handleQuestionTypeChange = useCallback((questionId: string, type: "short-answer" | "multiple-choice" | "single-choice") => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q._id === questionId ? { ...q, type, options: type === "short-answer" ? [] : q.options, correctAnswers: type === "short-answer" ? ["Ваш текстовый ответ"] : [] } : q
            ),
        }));
    }, [onChangeTestFormData]);

    const handleOptionToggle = useCallback((questionId: string, option: string) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => {
                if (q._id === questionId) {
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
    }, [onChangeTestFormData]);

    const handleOptionChange = useCallback((questionId: string, index: number, newOption: string) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => {
                if (q._id === questionId) {
                    const updatedOptions = [...q.options];
                    updatedOptions[index] = newOption;

                    const updatedCorrectAnswers = q.correctAnswers.map((answer) =>
                        answer === q.options[index] ? newOption : answer
                    );

                    return {
                        ...q,
                        options: updatedOptions,
                        correctAnswers: updatedCorrectAnswers,
                    };
                }
                return q;
            }),
        }));
    }, [onChangeTestFormData]);

    const handleDeleteOption = useCallback((questionId: string, index: number) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => {
                if (q._id === questionId) {
                    return {
                        ...q,
                        options: q.options.filter((_, i) => i !== index),
                    };
                }
                return q;
            }),
        }));
    }, [onChangeTestFormData]);

    const handleDeleteQuestion = useCallback((questionId: string) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q._id !== questionId),
            randomizedQuestionsSets: prev.isQuestionsRandomized ? createRandomizedQuestionsSets(prev.questions.length - 1, prev.countRandomizedQuestionsSets) : [],
        }));
    }, [onChangeTestFormData]);

    const handleAddOption = useCallback((questionId: string) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => {
                if (q._id === questionId) {
                    return {
                        ...q,
                        options: [...q.options, `Новый вариант ответа ${q.options.length + 1}`],
                    };
                }
                return q;
            }),
        }));
    }, [onChangeTestFormData]);

    const handleTimeLimitChange = useCallback((questionId: string, timeLimit: number | undefined) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q._id === questionId ? { ...q, timeLimit: timeLimit === 0 ? undefined : timeLimit } : q
            ),
        }));
    }, [onChangeTestFormData]);

    const handleImageURLChange = useCallback((questionId: string, imageUrl: string) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q._id === questionId ? { ...q, imageUrl } : q
            ),
        }));
    }, [onChangeTestFormData]);

    const handleShortAnswerChange = useCallback((questionId: string, shortAnswer: string) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q._id === questionId ? { ...q, shortAnswer } : q
            ),
        }));
    }, [onChangeTestFormData]);

    const handleSingleChoiceToggle = useCallback((questionId: string, option: string) => {
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => {
                if (q._id === questionId) {
                    return {
                        ...q,
                        correctAnswers: [option],
                    };
                }
                return q;
            }),
        }));
    }, [onChangeTestFormData]);

    const createNewQuestion = useCallback((title?: string, options?: string[]) => {
        //@ts-ignore
        const newQuestion: IQuestion = {
            _id: (Math.random() * 5 * 100).toFixed(0),
            test: testData._id,
            title: title || `Вопрос №${testData.questions.length + 1}`,
            options: options || [
                "Вариант Ответа №1",
                "Вариант Ответа №2",
                "Вариант Ответа №3",
                "Вариант Ответа №4",
            ],
            type: "multiple-choice",
            shortAnswer: '',
            isNewQuestion: true,
            correctAnswers: [],
        };
        onChangeTestFormData((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
            randomizedQuestionsSets: prev.isQuestionsRandomized ? createRandomizedQuestionsSets(prev.questions.length + 1, prev.countRandomizedQuestionsSets) : [],
        }));
    }, [testData, onChangeTestFormData]);

    return (
        <div className={cls.TestForm}>
            <div className={classNames(cls.TestFormBlock,{},[cls.TestFormBlockHead])}>
                <TextField
                    value={testData?.name || ""}
                    onChange={(e) => handleTestNameChange(e.target.value)}
                    label='Название теста'
                    style={{ width: '100%' }}
                    variant="standard"
                />
                <TextField
                    value={testData?.description || ""}
                    onChange={(e) => handleTestDescriptionChange(e.target.value)}
                    className={cls.textareaDescription}
                    label="Описание теста"
                    multiline
                    rows={3}
                />
            </div>

            {testData.questions.map((question) => (
                <QuestionEdit
                    key={question._id}
                    question={question}
                    onQuestionChange={handleQuestionChange}
                    onQuestionTypeChange={handleQuestionTypeChange}
                    onOptionToggle={handleOptionToggle}
                    onOptionChange={handleOptionChange}
                    onDeleteOption={handleDeleteOption}
                    onDeleteQuestion={handleDeleteQuestion}
                    onAddOption={handleAddOption}
                    onTimeLimitChange={handleTimeLimitChange}
                    onImageURLChange={handleImageURLChange}
                    onShortAnswerChange={handleShortAnswerChange}
                    onSingleChoiceToggle={handleSingleChoiceToggle}
                />
            ))}

            <TextArea
                className={cls.textareaNewQuestion}
                onChange={(value) => setTextAreaValue(value)}
                value={textAreaValue}
                placeholder="Вставьте ваш вопрос с вариантами ответа (пример)
        ⠀
        Кто создал Linux?¶
             Ада Лавлейс ¶
             Алан Тьюринг¶
             Линус Торвальдс¶
        "
            />

            <Button
                className={cls.AddQuestion}
                onClick={() => {
                    const splitedValue = textAreaValue.split('\n');
                    let title = splitedValue[0];
                    splitedValue.shift();
                    createNewQuestion(title, splitedValue);
                    setTextAreaValue('');
                }}
                disabled={createQuestionIsLoading}
                theme={ButtonTheme.BACKGROUND}
            >
                <IoAddCircleOutline className={cls.IconAddQuestion}/> Добавить новый вопрос
            </Button>
        </div>
    );
});
