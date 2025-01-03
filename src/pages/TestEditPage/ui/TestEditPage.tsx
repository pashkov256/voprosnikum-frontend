import cls from './TestEditPage.module.scss';
import {useNavigate, useParams} from "react-router-dom";
import React, {memo, SyntheticEvent, useEffect, useState} from "react";
import {useGetTestByIdQuery, useUpdateTestMutation} from "entities/Test/model/slice/testSlice";
import {Box, Container, MenuItem, Select, SelectChangeEvent, Tab, Tabs} from "@mui/material";
import TextField from "@mui/material/TextField";
import {Button} from "shared/ui/Button/Button";
import {TestForm} from "entities/Test/ui/TestForm/TestForm";
import {ITest} from "entities/Test/model/types/test";
import {formatDateTimeForInput} from "shared/lib/date";
import {useGetGroupsQuery} from "entities/Group/model/slice/groupSlice";
import Loader from "shared/ui/Loader/Loader";
import {TableTestResults} from "entities/Test/ui/TableTestResults/TableTestResults";
import {useSelector} from "react-redux";
import {RootState} from "app/providers/StoreProvider/config/store";

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

const TestEditPage = memo((props: TestEditProps) => {
    const { className } = props;
    const { id } = useParams();
    const userData = useSelector((state: RootState) => state.auth.data);
    const {data:testData,isLoading:testDataIsLoading,refetch:refetchGetTest} = useGetTestByIdQuery({_id:id || ""})
    const [updateTestData,{isLoading:updateTestIsLoaing}] = useUpdateTestMutation()
    const {data:groupsData,isLoading:groupsDataIsLoading} = useGetGroupsQuery()
    const navigate = useNavigate()
    const [tabsValue, setTabsValue] = useState(0);
    const [testFormData, setTestFormData] = useState<ITest>();
    const isCreateMode = id === undefined;

    const handleChangeTabs = (event: SyntheticEvent, newValue:any) => {
        setTabsValue(newValue);
    };
    useEffect(()=>{
       document.title = 'Редактирование теста'
    },[])


    if(testData && groupsData ){
        //@ts-ignore
        if(userData._id !== testData.teacher._id){
            navigate('/')
        }
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
                                    alert("Успешно обновлено")
                                }
                            }}
                        >
                            Сохранить изменения
                        </Button>
                    </Container>

                </div>

                    <TabPanel value={tabsValue} index={0}>
                        <Container maxWidth="md" className={cls.tabContent}>
                            <TestForm testData={testData} refetchGetTest={refetchGetTest} onChangeTestFormData={setTestFormData} updateTestData={updateTestData}/>
                        </Container>
                    </TabPanel>

                    <TabPanel value={tabsValue} index={1}>
                        <Container maxWidth="lg" className={cls.tabContent}>
                            <TableTestResults id={id || ""}/>
                        </Container>
                    </TabPanel>

                    <TabPanel value={tabsValue} index={2}>
                        <Container maxWidth="md" className={cls.tabContent}>
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
                                        value={groupsData.find((group) => group._id === testFormData?.group)?.name}
                                        onChange={(e: SelectChangeEvent<string>) => //@ts-ignore
                                            setTestFormData((prevState) => {

                                                return {
                                                    ...prevState,
                                                    //@ts-ignore
                                                    group: groupsData.find((group) => group.name == e.target.value)._id
                                                }
                                            })
                                        }
                                        className={cls.selectForm}
                                        variant="outlined"
                                    >
                                        {groupsData.map((group) => <MenuItem
                                            value={group.name}>{group.name}</MenuItem>)}
                                    </Select>
                                </div>

                                {testFormData &&
                                    <div className={cls.settingInline}>
                                        <input
                                            checked={testFormData.isResultVisibleAfterDeadline}
                                            type="checkbox"
                                            className={cls.settingCheckbox}
                                            name={"isResultVisibleAfterDeadline"}
                                            onChange={(e) => //@ts-ignore
                                                setTestFormData((prevState) => {
                                                    return {
                                                        ...prevState,
                                                        isResultVisibleAfterDeadline: e.target.checked
                                                    }
                                                })
                                            }
                                        />
                                        <label htmlFor={"isResultVisibleAfterDeadline"} className={cls.settingLabel}>Показывать
                                            студенту результат теста только после истечения срока сдачи?</label>
                                    </div>
                                }

                            </div>
                        </Container>
                    </TabPanel>
            </div>
        )
    }
    return <Loader/>
});

export default TestEditPage;
