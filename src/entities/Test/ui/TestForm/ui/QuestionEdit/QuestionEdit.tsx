import React, {memo} from "react";
import cls from "entities/Test/ui/TestForm/ui/TestForm/TestForm.module.scss";
import {MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {RiDeleteBinLine} from "react-icons/ri";
import {IoIosClose} from "react-icons/io";

interface QuestionEditProps {
    question: any;
    onQuestionChange: (questionId: string, field: string, value: any) => void;
    onQuestionTypeChange: (questionId: string, type: "short-answer" | "multiple-choice" | "single-choice") => void;
    onOptionToggle: (questionId: string, option: string) => void;
    onOptionChange: (questionId: string, index: number, newOption: string) => void;
    onDeleteOption: (questionId: string, index: number) => void;
    onDeleteQuestion: (questionId: string) => void;
    onAddOption: (questionId: string) => void;
    onTimeLimitChange: (questionId: string, timeLimit: number | undefined) => void;
    onImageURLChange: (questionId: string, imageUrl: string) => void;
    onShortAnswerChange: (questionId: string, shortAnswer: string) => void;
    onSingleChoiceToggle: (questionId: string, option: string) => void;
}

export const QuestionEdit = memo(({
                               question,
                               onQuestionChange,
                               onQuestionTypeChange,
                               onOptionToggle,
                               onOptionChange,
                               onDeleteOption,
                               onDeleteQuestion,
                               onAddOption,
                               onTimeLimitChange,
                               onImageURLChange,
                               onShortAnswerChange,
                               onSingleChoiceToggle,
                           }: QuestionEditProps) => {
    return (
        <div className={cls.TestFormBlock}>
            <TextField
                className={cls.questionInput}
                value={question.title || ""}
                onChange={(e) => onQuestionChange(question._id, "title", e.target.value)}
                label={"Вопрос"}
                style={{ width: '100%' }}
                variant="standard"
            />
            <Select
                value={question?.type}
                onChange={(e: SelectChangeEvent<"short-answer" | "multiple-choice" | 'single-choice'>) =>
                    onQuestionTypeChange(question._id, e.target.value as "short-answer" | "multiple-choice" | 'single-choice')
                }
                className={cls.selectForm}
                variant="outlined"
                MenuProps={{ disableScrollLock: true }}
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
                        if(confirm('Вы точно хотите удалить вопрос?')){
                            onDeleteQuestion(question._id)
                        }
                    }}
                />
            </div>

            <div className={cls.settings}>
                {question.type === 'multiple-choice' ? (
                    <div className={cls.AnswerOptions}>
                        {/*@ts-ignore*/}
                        {question.options.map((option, index) => (
                            <div className={cls.multiChoice} key={index}>
                                <label className={cls.AnswerOptionLabel}>
                                    <input
                                        type="checkbox"
                                        name={`question-${question._id}`}
                                        value={option}
                                        checked={question.correctAnswers.includes(option)}
                                        onChange={() => onOptionToggle(question._id, option)}
                                        className={cls.AnswerOptionRadio}
                                    />
                                </label>
                                <TextField
                                    value={option}
                                    className={cls.answerOptionInput}
                                    onChange={(e) => onOptionChange(question._id, index, e.target.value)}
                                    variant={"standard"}
                                />
                                <IoIosClose
                                    className={cls.Icon}
                                    title={"Удалить вариант ответа"}
                                    onClick={() => onDeleteOption(question._id, index)}
                                />
                            </div>
                        ))}
                        <button
                            className={cls.AddAnswerOption}
                            onClick={() => onAddOption(question._id)}
                        >
                            + Добавить вариант ответа
                        </button>
                    </div>
                ) : question.type === 'short-answer' ? (
                    <TextField
                        className={cls.shortAnswerInput}
                        value={question.shortAnswer}
                        onChange={(e) => onShortAnswerChange(question._id, e.target.value)}
                        placeholder={"Укажите текстовый ответ"}
                        label={"Укажите текстовый ответ"}
                        variant={"standard"}
                    />
                ) : question.type === 'single-choice' && (
                    <div className={cls.AnswerOptions}>
                        {/*@ts-ignore*/}
                        {question.options.map((option, index) => (
                            <div className={cls.singleChoice} key={index}>
                                <label className={cls.AnswerOptionLabel}>
                                    <input
                                        type="radio"
                                        name={`question-${question._id}`}
                                        value={option}
                                        checked={question.correctAnswers[0] === option}
                                        onChange={() => onSingleChoiceToggle(question._id, option)}
                                        className={cls.AnswerOptionRadio}
                                    />
                                </label>
                                <TextField
                                    className={cls.answerOptionInput}
                                    value={option}
                                    onChange={(e) => onOptionChange(question._id, index, e.target.value)}
                                    variant={"standard"}
                                />
                                <IoIosClose
                                    className={cls.Icon}
                                    title={"Удалить вариант ответа"}
                                    onClick={() => onDeleteOption(question._id, index)}
                                />
                            </div>
                        ))}
                        <button
                            className={cls.AddAnswerOption}
                            onClick={() => onAddOption(question._id)}
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
                        onChange={(e) => onTimeLimitChange(question._id, Number(e.target.value))}
                        placeholder="Укажите время выполнения"
                        label="Время выполнения (сек)"
                        variant="standard"
                    />
                    <TextField
                        className={cls.input}
                        type={"url"}
                        value={question.imageUrl}
                        onChange={(e) => onImageURLChange(question._id, e.target.value)}
                        placeholder={"Укажите ссылку на изображение"}
                        label={"Ссылка на изображение"}
                        variant={"standard"}
                    />
                </div>
            </div>
        </div>
    );
});

