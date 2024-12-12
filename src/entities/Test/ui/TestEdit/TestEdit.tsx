import { classNames } from 'shared/lib/classNames/classNames';
import cls from './TestEdit.module.scss';
import {useNavigate, useParams} from "react-router-dom";
import {SyntheticEvent, useEffect, useState} from "react";
import {useLazyGetTestByIdQuery} from "entities/Test/model/slice/testSlice";
import {Box, Container, Tab, Tabs} from "@mui/material";
import axios from "api/api";
import {SERVER_URL} from "shared/const/const";
import {QuizForm} from "components/QuizForm/QuizForm";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import {Button} from "shared/ui/Button/Button";
import {TestForm} from "entities/Test/ui/TestForm/TestForm";

interface TestEditProps {
    className?: string;
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

export const TestEdit = (props: TestEditProps) => {
    const { className } = props;
    const { testId } = useParams();
    const [trigger,{data:testData,isLoading:testDataIsLoading}] = useLazyGetTestByIdQuery()
    const [tabsValue, setTabsValue] = useState(0);

    const isCreateMode = testId === undefined;
    const navigate = useNavigate();

    const handleChangeTabs = (event: SyntheticEvent, newValue:any) => {
        setTabsValue(newValue);
    };

    useEffect(() => {
        if (!isCreateMode) {
            trigger({_id:testId});
        };
    })
    return (
        <div className={cls.TestCreate}>
            <div className={cls.tabPanels}>
                <Container maxWidth="lg" className={cls.tabPanelsContent}>
                    <Tabs value={tabsValue} onChange={handleChangeTabs}>
                        <Tab label="Вопросы"/>
                        {!isCreateMode && <Tab label="Ответы"/>}
                        <Tab label="Настройки"/>
                    </Tabs>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <Button
                        className={cls.BtnSaveForm}
                    >
                        Сохранить изменения
                    </Button>
                </Container>

            </div>

            <div className={cls.TestContainer}>
                {/*{!testDataIsLoading && (*/}
                {/*    <TabPanel value={tabsValue} index={0}>*/}
                {/*        /!*<QuizForm*!/*/}
                {/*        /!*    quizData={quizData}*!/*/}
                {/*        /!*    answersData={answersData}*!/*/}
                {/*        /!*    onChangeQuizData={setQuizData}*!/*/}
                {/*        /!*    onChangeAnswerData={setAnswersData}*!/*/}
                {/*        /!*//*/}
                {/*        <TestForm testData={[]} isCreateMode={isCreateMode}/>*/}
                {/*    </TabPanel>*/}
                {/*)}*/}


                    <TabPanel value={tabsValue} index={0}>
                        {isCreateMode ? <TestForm testData={{
                            _id: "",
                            name: "",
                            description: "",
                            teacher: "",
                            group: "", //id
                            deadline: "",
                            createdAt: "",
                            updatedAt: "",
                        }} /> : !testDataIsLoading && <TestForm testData={testData}/>
                        }

                    </TabPanel>


                {!isCreateMode &&
                    <>
                        <TabPanel value={tabsValue} index={1}>
                            {/*{(!quizResultsIsLoading && quizResults?.quizResults.length !== 0) && <div>*/}
                            {/*    <TableContainer component={Paper}>*/}
                            {/*        <Table sx={{minWidth: 650}} aria-label="simple table">*/}
                            {/*            <TableHead>*/}
                            {/*                <TableRow>*/}
                            {/*                    <TableCell>Имя пользователя</TableCell>*/}
                            {/*                    <TableCell align="right">Правильных вопросов</TableCell>*/}

                            {/*                </TableRow>*/}
                            {/*            </TableHead>*/}
                            {/*            <TableBody>*/}
                            {/*                {(quizResults !== null) && quizResults.quizResults.map((quizResult, index) => {*/}
                            {/*                    if (((index + 1) % 2) !== 0) {*/}
                            {/*                        return (*/}
                            {/*                            <TableRow*/}
                            {/*                                key={quizResult.userName}*/}
                            {/*                                sx={{'&:last-child td, &:last-child th': {border: 0}}}*/}
                            {/*                            >*/}
                            {/*                                <TableCell align="left">{quizResult.userName}</TableCell>*/}
                            {/*                                <TableCell*/}
                            {/*                                    align="right">{`${quizResult.countUser} из ${quizResult.countAll}`}</TableCell>*/}
                            {/*                            </TableRow>*/}
                            {/*                        )*/}
                            {/*                    }*/}

                            {/*                })}*/}
                            {/*            </TableBody>*/}
                            {/*        </Table>*/}
                            {/*    </TableContainer>*/}
                            {/*</div>*/}
                            {/*}*/}
                            {/*{(quizResults?.quizResults.length === 0 && quizResultsIsLoading === false) &&*/}
                            {/*    <h1 style={{textAlign: 'center'}}>Пока что никто не прошёл опрос</h1>}*/}
                        </TabPanel>
                    </>
                }

                <TabPanel value={tabsValue} index={isCreateMode ? 1 : 2}>
                    <div className={cls.settingsBlock}>
                        <h3 className={cls.settingsTitle}>Опрос доступен до:</h3>
                        {/*value={availableUntil || ''} */}
                        {/*<TextField value={testData.deadline || ''} className={cls.settingsInput} type={"date"}*/}
                        {/*           onChange={(e) => {*/}
                        {/*               //@ts-ignore*/}
                        {/*               // setAvailableUntil(e.target.value);*/}
                        {/*               // setQuizData({...quizData, availableUntil: e.target.value})*/}
                        {/*           }}/>*/}
                    </div>
                </TabPanel>

            </div>

        </div>

    )

};
