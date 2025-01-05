import { Container } from '@mui/material';
import { ITest } from 'entities/Test';
import { ITestWithPopulate } from 'entities/Test/model/types/test';
import { classNames } from 'shared/lib/classNames/classNames';
import { formatDate } from 'shared/lib/date';
import { Button, ButtonTheme } from 'shared/ui/Button/Button';
import cls from './TestPage.module.scss';

interface TestStartProps {
   testData:ITestWithPopulate;
   onStartTest:()=>void
}

export const TestStart = ({ testData, onStartTest }:TestStartProps) => (
   <Container maxWidth="lg" className={cls.testContainer}>
       <div className={cls.blockStart}>
           <div className={cls.blockStartInfoWrapper}>
               <div className={cls.blockStartInfo}>
                   <span className={cls.blockStartInfoLeft}>Название теста:</span>
                   <span className={cls.blockStartInfoRight}>{testData.name}</span>
               </div>
               {testData.description && (
                   <div className={cls.blockStartInfo}>
                       <span className={cls.blockStartInfoLeft}>Описание теста:</span>
                       <span className={classNames(cls.blockStartInfoRight, {}, [cls.blockStartInfoDescription])}>
                           {testData.description}
                       </span>
                   </div>
               )}
               <div className={cls.blockStartInfo}>
                   <span className={cls.blockStartInfoLeft}>Преподаватель:</span>
                   <span className={cls.blockStartInfoRight}>{testData.teacher?.fullName}</span>
               </div>
               {testData?.timeLimit !== 0 && (
                   <div className={cls.blockStartInfo}>
                       <span className={cls.blockStartInfoLeft}>Ограничение по времени:</span>
                       <span className={cls.blockStartInfoRight}>{testData?.timeLimit} минут</span>
                   </div>
               )}
               {testData?.deadline && (
                   <div className={cls.blockStartInfo}>
                       <span className={cls.blockStartInfoLeft}>Тест актуален до:</span>
                       <span className={cls.blockStartInfoRight}>{formatDate(testData?.deadline)}</span>
                   </div>
               )}
               <div className={cls.blockStartInfo}>
                   <span className={cls.blockStartInfoLeft}>Количество вопросов:</span>
                   <span className={cls.blockStartInfoRight}>{testData.questions.length}</span>
               </div>
           </div>
           <Button className={cls.buttonStart} theme={ButtonTheme.BACKGROUND} onClick={onStartTest}>
               Начать тест
           </Button>
       </div>
   </Container>
);
