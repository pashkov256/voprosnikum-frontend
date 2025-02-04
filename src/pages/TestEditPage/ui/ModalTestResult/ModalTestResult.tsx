import {ITestResultDetails} from 'entities/Test/model/types/test';
import React from 'react';
import {BiSelectMultiple} from "react-icons/bi";
import {BsFillQuestionSquareFill} from "react-icons/bs";
import {RiInputField} from "react-icons/ri";
import {VscDebugBreakpointLog} from "react-icons/vsc";
import {MdModeEdit} from "react-icons/md";
import {IoCheckmarkSharp, IoCloseSharp} from "react-icons/io5";
import {Button} from 'shared/ui/Button/Button';
import Modal from 'shared/ui/Modal/Modal';
import cls from './ModalTestResult.module.scss';
import {useLazyDeleteTestResultQuery} from "entities/Test/model/slice/testSlice";
import {classNames} from "shared/lib/classNames/classNames";

interface ModalTestResultProps {
   setOpenModalTestResult: (open: boolean) => void;
    handleRefetchTestResults: () => void;
   testResult: ITestResultDetails;
   open: boolean
}

const notCorrectColor = "#f12f38";
const correctColor = "#30ad8d"

function ModalTestResult(props: ModalTestResultProps) {
   const { setOpenModalTestResult, open, testResult,handleRefetchTestResults } = props;
   const [deleteTestResult] = useLazyDeleteTestResultQuery()
   console.log(testResult);

   const onClose = () => {
      setOpenModalTestResult(false)
   }
   const onOpen = () => {
      setOpenModalTestResult(true)
   }



   return (
      <Modal open={open} onClose={onClose} className={cls.modal}>

         <div className={cls.resultHeader}>
            <span className={cls.studentFullName}>{testResult.student.fullName}</span>
         </div>

         <div className={cls.resultBody}>
            <div className={cls.questionsCardList}>
               {testResult.testAnswers.map((testAnswer, index) => {
                  console.log(testAnswer.question.title);
                  let borderColor = "#e4e6e7";
                  if (testAnswer.pointsAwarded > 0) {
                     borderColor = correctColor
                  } else if (testAnswer.pointsAwarded === 0) {
                     borderColor = notCorrectColor
                  }

                  return <div key={testAnswer._id} className={cls.questionCard}>
                      <div className={cls.questionCardHeader}>
                          <div className={cls.questionCardHeaderLeft}>
                              <div className={cls.questionIndexWrapper}>
                                  <BsFillQuestionSquareFill color='#01a1d5'/>
                                  <span className={cls.questionIndex}>Вопрос №{index + 1}</span>
                              </div>
                          </div>
                          <div className={cls.questionCardHeaderRight}>
                              <div className={cls.questionTypeBlock}>
                                  {testAnswer.question.type === "multiple-choice" ?
                                      <>
                                          <BiSelectMultiple className={cls.questionIcon}/>
                                          <span className={cls.questionType}>Множественный выбор</span>

                                      </>
                                      : testAnswer.question.type === "single-choice" ?
                                          <>
                                              <BiSelectMultiple className={cls.questionIcon}/>
                                              <span className={cls.questionType}>Одиночный выбор</span>

                                          </>
                                          : <>
                                              <RiInputField className={cls.questionIcon}/>
                                              <span className={cls.questionType}>Короткий ответ</span>

                                          </>
                                  }

                              </div>
                              <div className={cls.questionPointBlock}>
                                  <div className={cls.pointWrapper} style={{backgroundColor: borderColor}}>
                                      <VscDebugBreakpointLog className={cls.pointIcon}/>
                                  </div>
                                  <span className={cls.questionPoint}>{testAnswer.pointsAwarded} балл</span>
                              </div>
                          </div>
                      </div>
                      <div className={cls.questionCardBottom}>
                          <span className={cls.questionTitle}>{testAnswer.question.title}</span>
                          {testAnswer.isTimeFail ? <div className={cls.answerBlock}>
                              <span>Студент не успел ответить на вопрос</span>
                          </div> : testAnswer.question.type === 'multiple-choice' || testAnswer.question.type === 'single-choice' ?
                                  <div className={cls.answerBlock}>
                                      <span>{testAnswer.question.type === 'multiple-choice' ? "Выбранные ответы:" : "Выбранный ответ:"}</span>
                                      <div className={cls.selectedAnswerList}>
                                          {testAnswer.selectedOptions.map((option, index) => (
                                              <div className={cls.selectedAnswerBlock}>
                                                  {testAnswer.question.correctAnswers.includes(option)
                                                      ?
                                                      <IoCheckmarkSharp  className={classNames(cls.selectedAnswerIcon,{},[cls.selectedAnswerIconCorrect])}/>

                                                      :
                                                      <IoCloseSharp className={classNames(cls.selectedAnswerIcon,{},[cls.selectedAnswerIconFail])}/>

                                                  }
                                                  <span className={cls.selectedAnswer}>{option}</span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                                  : testAnswer.question.type === 'short-answer' &&
                                  <div className={cls.answerBlock}>
                                      <span>Текстовый ответ:</span>
                                      <div className={cls.selectedAnswerBlock}>
                                          {testAnswer.shortAnswer.toLowerCase() === testAnswer.question.shortAnswer.toLowerCase()
                                              ?
                                              <IoCheckmarkSharp
                                                  className={classNames(cls.selectedAnswerIcon, {}, [cls.selectedAnswerIconCorrect])}/>

                                              :
                                              <IoCloseSharp
                                                  className={classNames(cls.selectedAnswerIcon, {}, [cls.selectedAnswerIconFail])}/>

                                          }
                                          <span className={cls.selectedAnswer}>{testAnswer.shortAnswer}</span>
                                      </div>
                                  </div>
                          }

                          {testAnswer.__v !== 0 && <div className={cls.answerBlock}>
                              <span>Кол-во изменений ответа: {testAnswer.__v}</span>

                          </div>}
                      </div>

                  </div>
               })}

            </div>
         </div>
          <Button className={cls.resultDeleteButton} onClick={async () => {
              await deleteTestResult(testResult._id);
              handleRefetchTestResults()
              onClose()
          }}>Удалить результат прохождения</Button>
      </Modal>
   )
}

export default ModalTestResult
