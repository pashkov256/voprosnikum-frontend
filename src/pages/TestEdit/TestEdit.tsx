import { classNames } from 'shared/lib/classNames/classNames';
import cls from 'pages/TestEdit/TestEdit.module.scss';
import {useNavigate, useParams} from "react-router-dom";
import React, {memo, SyntheticEvent, useEffect, useState} from "react";
import {
    useGetTestAllResultsQuery,
    useGetTestByIdQuery,
    useGetTestResultQuery,
    useLazyGetTestByIdQuery,
    useUpdateTestMutation
} from "entities/Test/model/slice/testSlice";
import {Box, Container, MenuItem, Select, SelectChangeEvent, Tab, Tabs} from "@mui/material";
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
import {ITest} from "entities/Test/model/types/test";
import formatDateTimeForInput from "shared/lib/formatDateTimeForInput/formatDateTimeForInput";
import {useGetGroupsQuery} from "entities/Group/model/slice/groupSlice";
import Loader from "shared/ui/Loader/Loader";
import {TableTestResults} from "entities/Test/ui/TableTestResults/TableTestResults";

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

const TestEdit = memo((props: TestEditProps) => {
    const { className } = props;
    const { id } = useParams();
    const {data:testData,isLoading:testDataIsLoading,refetch:refetchGetTest} = useGetTestByIdQuery({_id:id || ""})
    const [updateTestData,{isLoading:updateTestIsLoaing}] = useUpdateTestMutation()
    const {data:groupsData,isLoading:groupsDataIsLoading} = useGetGroupsQuery()

    const [tabsValue, setTabsValue] = useState(0);
    const [testFormData, setTestFormData] = useState<ITest>();
    const isCreateMode = id === undefined;
    //@ts-ignore
    const { data: testAllResult,refetch:refetchTestResult } = useGetTestAllResultsQuery({ test: id || ""});
    const handleChangeTabs = (event: SyntheticEvent, newValue:any) => {
        setTabsValue(newValue);
    };
    console.log(testAllResult)
    useEffect(()=>{
       document.title = 'Редактирование теста'
    },[])


    if(testData && groupsData ){
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
                            onClick={()=>{
                                if(testFormData){
                                    console.log(testFormData)
                                    updateTestData({...testFormData})
                                }
                            }}
                        >
                            Сохранить изменения
                        </Button>
                    </Container>

                </div>

                <div className={cls.TestContainer}>
                    <TabPanel value={tabsValue} index={0}>
                      <TestForm testData={testData} refetchGetTest={refetchGetTest} onChangeTestFormData={setTestFormData} updateTestData={updateTestData}/>
                    </TabPanel>

                    <TabPanel value={tabsValue} index={1}>
                        <TableTestResults id={id || ""}/>
                    </TabPanel>

                    <TabPanel value={tabsValue} index={2}>
                        <div className={cls.settingsBlock}>
                            <div className={cls.setting}>
                                <h3 className={cls.settingsTitle}>Опрос доступен до:</h3>

                                <TextField value={formatDateTimeForInput(testFormData?.deadline || '')}
                                           className={cls.settingsInput} type={"datetime-local"}
                                           onChange={(e) => {
                                               //@ts-ignore
                                               setTestFormData((prevState) => {
                                                   console.log(e.target.value)
                                                   return {
                                                       ...prevState, deadline:
                                                       e.target.value
                                                   }
                                               })
                                           }}/>
                            </div>

                            <div className={cls.setting}>
                                <h3 className={cls.settingsTitle}>Время прохождения теста (минуты)</h3>

                                <TextField value={testFormData?.timeLimit === 0 ? "" : testFormData?.timeLimit}
                                           className={cls.settingsInput} type={"number"} placeholder={"В минутах"}
                                           onChange={(e) => {
                                               //@ts-ignore
                                               setTestFormData((prevState) => {
                                                   //@ts-ignore
                                                   return {...prevState, timeLimit: Number(e.target.value)}
                                               })
                                           }}/>
                            </div>

                            <div className={cls.setting}>
                                <h3 className={cls.settingsTitle}>Для какой группы тест</h3>

                                <Select
                                    //@ts-ignore
                                    value={groupsData.find((group)=>group._id === testFormData?.group)?.name}
                                    onChange={(e: SelectChangeEvent<string>) => //@ts-ignore
                                        setTestFormData((prevState) => {
                                            //@ts-ignore
                                            return {...prevState, group: groupsData.find((group)=> group.name == e.target.value)._id}
                                        })
                                }
                                    className={cls.selectForm}
                                    variant="outlined"
                                >
                                    {groupsData.map((group)=><MenuItem value={group.name}>{group.name}</MenuItem>)}
                                </Select>
                            </div>

                        </div>
                    </TabPanel>
                </div>
            </div>
        )
    }
    return <Loader/>
});

export default TestEdit;
