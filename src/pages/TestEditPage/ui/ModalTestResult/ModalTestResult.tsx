import {ITestResultDetails} from 'entities/Test/model/types/test';
import React from 'react';
import {BiSelectMultiple} from "react-icons/bi";
import {BsFillQuestionSquareFill} from "react-icons/bs";
import {RiInputField} from "react-icons/ri";
import {VscDebugBreakpointLog} from "react-icons/vsc";
import {MdModeEdit} from "react-icons/md";
import {Button} from 'shared/ui/Button/Button';
import Modal from 'shared/ui/Modal/Modal';
import cls from './ModalTestResult.module.scss';
import {useLazyDeleteTestResultQuery} from "entities/Test/model/slice/testSlice";

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
                  console.log(testAnswer.question.title1);
                  let borderColor = "#e4e6e7";
                  if (testAnswer.pointsAwarded >= 0.5) {
                     borderColor = correctColor
                  } else if (testAnswer.pointsAwarded === 0) {
                     borderColor = notCorrectColor
                  }

                  return <div key={testAnswer._id} className={cls.questionCard}>
                     <div className={cls.questionCardHeader}>
                        <div className={cls.questionCardHeaderLeft}>
                           <div className={cls.questionIndexWrapper}>
                              <BsFillQuestionSquareFill color='#01a1d5' />
                              <span className={cls.questionIndex}>Вопрос {index + 1}</span>
                           </div>
                        </div>
                         <div className={cls.questionCardHeaderRight}>
                             {testAnswer.__v !== 0 && <div className={cls.questionTypeBlock}>
                                 <MdModeEdit/>
                                 <span className={cls.questionType}>Кол-во изменений ответа: {testAnswer.__v}</span>
                             </div>}
                             <div className={cls.questionTypeBlock}>
                                 {testAnswer.question.type === "multiple-choice" ?
                                     <>
                                     <BiSelectMultiple/>
                                         <span className={cls.questionType}>Множественный выбор</span>

                                     </>
                                     : testAnswer.question.type === "single-choice" ?
                                         <>
                                             <BiSelectMultiple/>
                                             <span className={cls.questionType}>Одиночный выбор</span>

                                         </>
                                         : <>
                                             <RiInputField/>
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
                      <span className={cls.questionTitle}>{testAnswer.question.title1}</span>
                  </div>
               })}

            </div>
         </div>
          <Button className={cls.resultDeleteButton} onClick={async ()=>{
              await deleteTestResult(testResult._id);
              handleRefetchTestResults()
              onClose()
          }}>Удалить результат прохождения</Button>
      </Modal>
   )
}

export default ModalTestResult
