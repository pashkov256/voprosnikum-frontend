import { Container } from '@mui/material';
import { ITest } from 'entities/Test';
import { memo } from 'react';
import { IoMdTime } from 'react-icons/io';
import { LuTimer } from 'react-icons/lu';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { classNames } from 'shared/lib/classNames/classNames';
import { Input } from 'shared/ui/Input/Input';
import cls from './TestPage.module.scss';


interface TestProps {
   testData: ITest,
   currentQuestion: number,
   selectedOptions: string[],
   setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>,
   setShortAnswerValue: (value: string) => void,
   handleNextQuestion: () => void,
   shortAnswerValue: string,
   testSecondsLeft: number | null,
   questionSecondsLeft: number | null,
   buttonsIsDisabled: boolean,
   isComplete: boolean,
}

export const Test = memo(({
   testData,
   currentQuestion,
   selectedOptions,
   setSelectedOptions,
   handleNextQuestion,
   shortAnswerValue,
   setShortAnswerValue,
   testSecondsLeft,
   questionSecondsLeft,
   isComplete,
   buttonsIsDisabled,
}: TestProps) => (
   <Container maxWidth="lg" className={classNames(cls.testContainer, { [cls.wrapperWithTimer]: !(testSecondsLeft !== null && !(testSecondsLeft > 0)) }, [])}>
      <div className={classNames(cls.testWrapper, {}, [])} >
         {(testData.timeLimit !== 0) && !isComplete && <div
            className={cls.testSecondLeftBlock}
         // style={(testSecondsLeft !== null && !(testSecondsLeft > 0) || testResult?.completedAt || "") ? {display: "none"} : {}}
         >
            {/*таймер на тест*/}
            <IoMdTime size={32} className={cls.iconTestSecondLeft} />

            <span className={cls.testSecondLeftTimer}>

               {Math.floor((testSecondsLeft || 0) / 60)}:
               {(testSecondsLeft || 0) % 60 < 10
                  ? `0${(testSecondsLeft || 0) % 60}`
                  : (testSecondsLeft || 0) % 60}
            </span>
            <span className={cls.testSecondLeftText}>мин</span>

         </div>}
         <div className={classNames(cls.quiz, {}, [])}>
            <div className={cls["quiz-wrapper"]}>
               <>
                  {questionSecondsLeft !== null && (
                     <div className={classNames(cls["quiz-timer"], {}, [cls.quizIconBlock])}>
                        {/*таймер на вопрос*/}
                        <LuTimer size={32} className={cls.iconQuestionTimer} />
                        <span className={cls["question-count-text"]}>{questionSecondsLeft}</span>
                     </div>
                  )}
                  <div className={classNames(cls["quiz-question-count"], {}, [cls.quizIconBlock])}>
                     <RiQuestionAnswerLine size={32} className={cls.iconQuestion} />
                     <span
                        className={cls["question-count-text"]}>{currentQuestion + 1} из {testData.questions.length}</span>
                  </div>
                  <div className={cls.testInnerWrapper} style={{ width: '100%' }}>
                     <div className={cls["question-text-wrapper"]}>
                        <h3 className={cls["question-text"]}>{testData.questions[currentQuestion].title1}</h3>
                     </div>
                     {testData.questions[currentQuestion]?.imageUrl && (
                        <div className={cls.quizImageBlock}>
                           <img src={testData.questions[currentQuestion].imageUrl || ""}
                              className={cls["quizImage"]} />
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
                                    if (testData.questions[currentQuestion].type === "multiple-choice") {
                                       setSelectedOptions((prev) =>
                                          prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
                                       )
                                    } else {
                                       setSelectedOptions((prev) =>
                                          prev.includes(option) ? prev.filter((o) => o !== option) : [option]
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
                              onChange={(value) => setShortAnswerValue(value)} />
                        </div>
                     )}
                     <button
                        className={cls["btn-continue"]}
                        onClick={handleNextQuestion}
                     /*переход на след вопрос*/
                     >
                        {currentQuestion >= testData.questions.length - 1 ? "Завершить" : "Продолжить"}
                     </button>
                  </div>
               </>
            </div>
         </div>
      </div>
   </Container>
));