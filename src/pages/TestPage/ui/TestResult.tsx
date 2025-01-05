import { Container } from '@mui/material';
import { ITest, ITestResult } from 'entities/Test';
import { getColorByScore } from 'shared/lib/getColorByScore/getColorByScore';
import cls from './TestPage.module.scss';

interface TestResultProps {
   testResult:ITestResult;
}

export const TestResult = ({ testResult }:TestResultProps) => (
   <Container maxWidth="lg" className={cls.testContainer}>
       <div className={cls.blockFinish}>
           <div className={cls.blockStartInfoWrapper}>
               <div className={cls.blockStartInfo}>
                   <span className={cls.blockFinishInfoLeft}>Оценка:</span>
                   <span
                       className={cls.blockFinishInfoRight}
                       style={{ color: getColorByScore(testResult?.score || 1), fontWeight: 700 }}
                   >
                       {testResult.score}
                   </span>
               </div>
               <div className={cls.blockStartInfo}>
                   <span className={cls.blockFinishInfoLeft}>Пройдено за:</span>
                   <span className={cls.blockFinishInfoRight}>{testResult.completionTime} мин</span>
               </div>
           </div>
       </div>
   </Container>
);