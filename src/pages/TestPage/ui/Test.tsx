import { Container } from '@mui/material';
import { ITest } from 'entities/Test';
import { IQuestion, ITestAnswer, ITestResult } from 'entities/Test/model/types/test';
import { memo } from 'react';
import { IoMdTime } from 'react-icons/io';
import { LuTimer } from 'react-icons/lu';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { classNames } from 'shared/lib/classNames/classNames';
import { Input } from 'shared/ui/Input/Input';
import cls from './TestPage.module.scss';


interface TestProps {
   testData: ITest,
   testResult: ITestResult | undefined,
   currentQuestion: number,
   currentQuestionData: IQuestion,
   selectedOptions: string[],
   setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>,
   setShortAnswerValue: (value: string) => void,
   setButtonsIsDisabled: (value: boolean) => void,
   handleNextQuestion: () => void,
   handleToPrevQuestion: () => void,
   haveSelectedOptionsChanged: () => boolean,
   shortAnswerValue: string,
   testSecondsLeft: number | null,
   questionSecondsLeft: number | null,
   buttonsIsDisabled: boolean,
   isComplete: boolean,
   isBackMode: boolean,
   inputIsDisabled: boolean,
}

export const Test = memo(({
   testData,
   testResult,
   currentQuestion,
   currentQuestionData,
   selectedOptions,
   setSelectedOptions,
   handleNextQuestion,
   handleToPrevQuestion,
   haveSelectedOptionsChanged,
   shortAnswerValue,
   setShortAnswerValue,
   testSecondsLeft,
   questionSecondsLeft,
   isComplete,
   isBackMode,
   buttonsIsDisabled,
   inputIsDisabled,
}: TestProps) => {
   console.log({ shortAnswerValue });
   console.log({ FUNC: haveSelectedOptionsChanged() });
   console.log({ shortAnswerValue });
   console.log({ testres_ANSWER: testResult?.testAnswers[currentQuestion]?.shortAnswer });

   return (
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
                           <h3 className={cls["question-text"]}>{currentQuestionData.title1}</h3>
                        </div>
                        {currentQuestionData?.imageUrl && (
                           <div className={cls.quizImageBlock}>
                              <img src={currentQuestionData.imageUrl || ""}
                                 className={cls["quizImage"]} />
                           </div>
                        )}

                        {currentQuestionData.type === "multiple-choice" ?
                           <p
                              className={cls.choiseTypeText}>Выберите несколько вариантов ответа</p> : currentQuestionData.type === "single-choice" &&
                           <p className={cls.choiseTypeText}>Выберите один вариант ответа</p>}
                        {currentQuestionData.type === "multiple-choice" || currentQuestionData.type === "single-choice" ? (
                           <div className={cls["quiz-questions"]}>
                              {currentQuestionData.options.map((option: string) => {
                                 return (
                                    <button
                                       key={option}
                                       className={classNames(cls["quiz-question"], {
                                          [cls.optionSelected]: selectedOptions.includes(option),
                                       })}
                                       onClick={() => {
                                          if (currentQuestionData.type === "multiple-choice") {
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
                                 )
                              })}
                           </div>
                        ) : (
                           <div className={cls.shortAnswerBlock}>
                              <Input placeholder={"Введите ответ"} className={cls.shortAnswerInput}
                                 value={shortAnswerValue}
                                 disabled={inputIsDisabled}
                                 onChange={(value) => setShortAnswerValue(value)} />
                           </div>
                        )}
                        <div className={cls.navigationButtons}>
                           <button
                              className={cls.buttonBack}
                              onClick={handleToPrevQuestion}
                           /*переход на предыдущий вопрос*/
                           >
                              Предыдущий вопрос
                           </button>
                           <button
                              className={cls["btn-continue"]}
                              onClick={handleNextQuestion}
                           /*переход на след вопрос*/
                           >
                              {/* {currentQuestion >= testData.questions.length - 1 ? "Завершить" : (isBackMode && (selectedOptions.length !== 0 && (currentQuestionData?.type === 'multiple-choice') || (currentQuestionData?.type === 'single-choice')) || (shortAnswerValue !== "" && currentQuestionData?.type === 'short-answer')) ? "Изменить ответ" : isBackMode ? "Следующий вопрос" : "Ответить"} */}
                              {currentQuestion >= testData.questions.length - 1 ? "Завершить" : isBackMode && (haveSelectedOptionsChanged() || shortAnswerValue !== testResult?.testAnswers[currentQuestion]?.shortAnswer) ? "Сохранить изменения" : isBackMode ? "Следующий вопрос" : "Ответить"}
                           </button>
                        </div>
                     </div>
                  </>
               </div>
            </div>
         </div>
      </Container>
   )
});

