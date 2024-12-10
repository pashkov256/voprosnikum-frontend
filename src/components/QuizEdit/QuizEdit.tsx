// eslint-disable-file
import {
    Box, Container, Tab, Tabs,
} from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from '../../api/api';
import { SERVER_URL } from 'shared/const/const';
import cls from './QuizEdit.module.scss';
import { QuizForm } from '../QuizForm/QuizForm';
import { IAnswer, IQuiz } from '../../model/IQuiz';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {IQuizResult} from '../../model/IQuiz'
import QuizFormInput from "../QuizFormInput/QuizFormInput";
import TextField from '@mui/material/TextField';
{ /* eslint-disable-next-line react/button-has-type */ }

interface QuizCreateProps {
}

function TabPanel(props:any) {
    const {
        children, value, index, ...other
    } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}



export const QuizEdit = (props: QuizCreateProps) => {
    const [value, setValue] = useState(0);
    const { quizId } = useParams();
    const isCreateMode = quizId === undefined;
    const navigate = useNavigate();
    const [availableUntil,setAvailableUntil] = useState()
    const [quizData, setQuizData] = useState<IQuiz>({
        _id: '',
        title: '',
        questions: [],
        createdAt: '',
        createdBy: '',
        availableUntil:'',
        peoplePassed: 0,
    });
    const [quizResults,setQuizResults] = useState<IQuizResult | null>(null)
    const [answersData, setAnswersData] = useState<IAnswer[]>([]);
    const [quizDataIsLoading, setQuizDataIsLoading] = useState(!isCreateMode);
    const [quizResultsIsLoading, setQuizResultsIsLoading] = useState(!isCreateMode);
    const handleChange = (event: SyntheticEvent, newValue:any) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (!isCreateMode) {
            const getQuizById = async () => {
                try {
                    const { data } = await axios.get<{quiz:IQuiz, answers:any}>(
                        `${SERVER_URL}/quiz/${quizId}/form`,
                    );
                    setQuizData(data.quiz);
                    setAnswersData(data.answers);
                } catch (e) {
                    alert(e);
                } finally {
                    setQuizDataIsLoading(false);
                }
            };
            const getQuizResults = async () => {
                try {
                    const { data } = await axios.get<IQuizResult>(
                        `${SERVER_URL}/quiz/${quizId}/results`
                    );

                    console.log(data)
                    //@ts-ignore
                    setQuizResults(data);
                } catch (e) {
                    alert(e);
                } finally {
                    setQuizResultsIsLoading(false);
                }
            };
            getQuizById();
            getQuizResults()
        }
    }, []);

    // @ts-ignore
    // @ts-ignore
    return (
        <div className={cls.QuizCreate}>
            <div className={cls.tabPanels}>
                <Container maxWidth="lg" className={cls.tabPanelsContent}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Вопросы" />
                        {!isCreateMode &&     <Tab label="Ответы" />}
                        <Tab label="Настройки" />
                    </Tabs>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                        className={cls.BtnSaveForm}
                        onClick={async () => {
                            if (isCreateMode) {
                                console.log({
                                    quiz: quizData,
                                    answers: answersData,
                                });
                                try {
                                    let formattedDate = ``;
                                    if(availableUntil !== undefined){
                                        //@ts-ignore
                                        const [year, month, day] = availableUntil.split('-');
                                        formattedDate = `${year}-${day}-${month}`;
                                    }
                                    console.log(formattedDate)
                                    await axios.post(
                                        `${SERVER_URL}/quiz/create`,
                                        // eslint-disable-next-line
                                        {
                                            title: quizData.title,
                                            questions: quizData.questions,
                                            answers: answersData,
                                            availableUntil:formattedDate
                                        },
                                    );
                                    alert("Успешно сохранено")
                                } catch (e) {
                                    alert(e);
                                }
                                navigate(`/`);
                            } else {
                                console.log("SSAAAAVE")
                                try {
                                    let formattedDate = ``;
                                    if(availableUntil !== undefined){
                                        //@ts-ignore
                                        const [year, month, day] = availableUntil.split('-');
                                        formattedDate = `${year}-${day}-${month}`;
                                    }
                                    await axios.post(
                                        `${SERVER_URL}/quiz/${quizId}/save`,
                                        {
                                            title: quizData.title,
                                            questions: quizData.questions,
                                            answers: answersData,
                                            availableUntil:formattedDate
                                        },
                                    );

                                    alert("Успешно сохранено")
                                    navigate(`/quiz/${quizId}/edit`);
                                } catch (e) {
                                    alert(e);
                                }
                            }


                        }}
                    >
                        Сохранить изменения
                    </button>
                </Container>

            </div>

            <div className={cls.QuizContainer}>
                {!quizDataIsLoading && (
                    <TabPanel value={value} index={0}>
                        <QuizForm
                            quizData={quizData}
                            answersData={answersData}
                            onChangeQuizData={setQuizData}
                            onChangeAnswerData={setAnswersData}
                        />
                    </TabPanel>
                )}

                {!isCreateMode &&
                 <>
                     <TabPanel value={value} index={1}>
                         {(!quizResultsIsLoading && quizResults?.quizResults.length !== 0)  && <div>
                             <TableContainer component={Paper}>
                                 <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                     <TableHead>
                                         <TableRow>
                                             <TableCell>Имя пользователя</TableCell>
                                             <TableCell align="right">Правильных вопросов</TableCell>

                                         </TableRow>
                                     </TableHead>
                                     <TableBody>
                                         {(quizResults !== null) && quizResults.quizResults.map((quizResult,index) => {
                                             if(((index+1) % 2) !== 0){
                                                 return (
                                                     <TableRow
                                                         key={quizResult.userName}
                                                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                     >
                                                         <TableCell align="left">{quizResult.userName}</TableCell>
                                                         <TableCell align="right">{`${quizResult.countUser} из ${quizResult.countAll}`}</TableCell>
                                                     </TableRow>
                                                 )
                                             }

                                         })}
                                     </TableBody>
                                 </Table>
                             </TableContainer>
                         </div>
                         }
                         {(quizResults?.quizResults.length === 0 && quizResultsIsLoading === false) && <h1 style={{textAlign:'center'}}>Пока что никто не прошёл опрос</h1> }
                     </TabPanel>
                 </>
                }

                <TabPanel value={value} index={isCreateMode ? 1 : 2}>
                    <div className={cls.settingsBlock}>
                        <h3 className={cls.settingsTitle}>Опрос доступен до:</h3>
                        {/*value={availableUntil || ''} */}
                        <TextField value={quizData.availableUntil || ''} className={cls.settingsInput} type={"date"}
                                   onChange={(e) => {
                                       //@ts-ignore
                                       setAvailableUntil(e.target.value);
                                       setQuizData({...quizData,availableUntil:e.target.value})
                                   }} />
                    </div>
                </TabPanel>

            </div>

        </div>
    );
};
