import { Box, Container, MenuItem, Select, SelectChangeEvent, Tab, Tabs } from "@mui/material";
import TextField from "@mui/material/TextField";
import { RootState } from "app/providers/StoreProvider/config/store";
import { useGetGroupsQuery } from "entities/Group/model/slice/groupSlice";
import {
    useGetTestAllResultsQuery,
    useGetTestByIdQuery,
    useUpdateTestMutation,
} from "entities/Test/model/slice/testSlice";
import { ITest, ITestResultDetails } from "entities/Test/model/types/test";
import { TableTestResults } from "entities/Test/ui/TableTestResults/TableTestResults";
import React, { memo, SyntheticEvent, useCallback, useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateTimeForInput } from "shared/lib/date";
import { createRandomizedQuestionsSets } from "shared/lib/shuffle/shuffle";
import { Button } from "shared/ui/Button/Button";
import Loader from "shared/ui/Loader/Loader";
import ModalTestResult from "./ModalTestResult/ModalTestResult";
import cls from './TestEditPage.module.scss';
import {TestForm} from "entities/Test/ui/TestForm";

interface TestEditProps {
    className?: string;
}

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }} className={cls.tabPanelContent}>{children}</Box>}
        </div>
    );
}

const TestEditPage = memo((props: TestEditProps) => {
    const { className } = props;
    const { id } = useParams();
    const userData = useSelector((state: RootState) => state.auth.data);
    const { data: testData, isLoading: testDataIsLoading, refetch: refetchGetTest } = useGetTestByIdQuery({
        _id: id || "",
        mode: "full",
    });
    const {
        data: testAllResults,
        isLoading: testAllResultsIsLoading,
        error: testAllResultsError,
        refetch: refetchGetTestResults,
    } = useGetTestAllResultsQuery(id || "");
    const [updateTestData, { isLoading: updateTestIsLoading }] = useUpdateTestMutation();
    const { data: groupsData, isLoading: groupsDataIsLoading } = useGetGroupsQuery();
    const navigate = useNavigate();
    const [tabsValue, setTabsValue] = useState(0);
    const [testResult, setTestResult] = useState<null | ITestResultDetails>(null);
    const [openModalTestResult, setOpenModalTestResult] = useState(false);
    const isCreateMode = id === undefined;
    //@ts-ignore
    const [testFormData, setTestFormData] = useState<ITest>(testData);

    useEffect(() => {
        if (testData) {
            setTestFormData(testData);
        }
    }, [testData]);

    const handleChangeTabs = (event: SyntheticEvent, newValue: any) => {
        setTabsValue(newValue);
    };

    const handleRefetchTestResults = async () => {
        await refetchGetTestResults();
    };

    useEffect(() => {
        document.title = "Редактирование теста";
    }, []);

    const handleSaveTest = () => {
        if (testFormData) {
            updateTestData({ ...testFormData });
            alert("Успешно обновлено");
        }
    };
    console.log({testFormData});
    if( testDataIsLoading) {
        return <Loader />
    }

    if (testFormData && groupsData ) {
        //@ts-ignore
        if (userData._id !== testData.teacher._id) {
            navigate("/");
        }
        return (
            <div className={cls.TestCreate}>
                <div className={cls.tabPanels}>
                    <Container maxWidth="lg" className={cls.tabPanelsContent}>
                        <Tabs value={tabsValue} onChange={handleChangeTabs} className={cls.tabsList}>
                            <Tab label="Вопросы" className={cls.tab}/>
                            {!isCreateMode && <Tab label="Результаты" className={cls.tab}/>}
                            <Tab label="Настройки" className={cls.tab}/>
                        </Tabs>
                        <Button
                            className={cls.BtnSaveForm}
                            onClick={handleSaveTest}
                        >
                            Сохранить изменения
                        </Button>
                    </Container>
                </div>

                <TabPanel value={tabsValue} index={0}>
                    <Container maxWidth="md" className={cls.tabContent}>
                        <TestForm
                            testData={testFormData}
                            refetchGetTest={refetchGetTest}
                            onChangeTestFormData={setTestFormData}
                            updateTestData={updateTestData}
                        />
                    </Container>
                </TabPanel>

                <TabPanel value={tabsValue} index={1}>
                    <Container maxWidth="lg" className={cls.tabContentResult}>
                        <TableTestResults
                            id={id || ""}
                            testData={testData}
                            setOpenModalTestResult={setOpenModalTestResult}
                            setTestResult={setTestResult}
                            testAllResults={testAllResults}
                            testAllResultsIsLoading={testAllResultsIsLoading}
                            testAllResultsError={testAllResultsError}
                        />
                        {testResult !== null && (
                            <ModalTestResult
                                open={openModalTestResult}
                                setOpenModalTestResult={setOpenModalTestResult}
                                testResult={testResult}
                                handleRefetchTestResults={handleRefetchTestResults}
                            />
                        )}
                    </Container>
                </TabPanel>

                <TabPanel value={tabsValue} index={2}>
                    <Container maxWidth="md" className={cls.tabContent}>
                        <div className={cls.settingsBlock}>
                            <div className={cls.setting}>
                                <h3 className={cls.settingsTitle}>Дата открытия теста:</h3>
                                <TextField
                                    value={formatDateTimeForInput(testFormData?.deadline || "")}
                                    className={cls.settingsInput}
                                    type={"datetime-local"}
                                    onChange={(e) => {
                                        setTestFormData((prev) => ({...prev, deadline: e.target.value}));
                                    }}
                                />
                            </div>
                            <div className={cls.setting}>
                                <h3 className={cls.settingsTitle}>Опрос доступен до:</h3>
                                <TextField
                                    value={formatDateTimeForInput(testFormData?.deadline || "")}
                                    className={cls.settingsInput}
                                    type={"datetime-local"}
                                    onChange={(e) => {
                                        setTestFormData((prev) => ({...prev, deadline: e.target.value}));
                                    }}
                                />
                            </div>

                            <div className={cls.setting}>
                                <h3 className={cls.settingsTitle}>Время прохождения теста (минуты)</h3>
                                <TextField
                                    value={testFormData?.timeLimit === 0 ? "" : testFormData?.timeLimit}
                                    className={cls.settingsInput}
                                    type={"number"}
                                    placeholder={"В минутах"}
                                    onChange={(e) => {
                                        setTestFormData((prev) => ({...prev, timeLimit: Number(e.target.value)}));
                                    }}
                                />
                            </div>

                            <div className={cls.setting}>
                                <h3 className={cls.settingsTitle}>Для какой группы тест</h3>
                                <Select
                                    value={groupsData.find((group) => group._id === testFormData?.group)?.name || ""}
                                    onChange={(e: SelectChangeEvent<string>) => {
                                        const selectedGroup = groupsData.find((group) => group.name === e.target.value);
                                        if (selectedGroup) {
                                            setTestFormData((prev) => ({...prev, group: selectedGroup._id}));
                                        }
                                    }}
                                    className={cls.selectForm}
                                    variant="outlined"
                                    MenuProps={{disableScrollLock: true}}
                                >
                                    {groupsData.map((group) => (
                                        <MenuItem key={group._id} value={group.name}>
                                            {group.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>

                            {testFormData?.isQuestionsRandomized && (
                                <div className={cls.setting}>
                                    <h3 className={cls.settingsTitle}>Количество вариантов со случайными вопросами</h3>
                                    <TextField
                                        value={testFormData?.countRandomizedQuestionsSets === 0 || testFormData?.countRandomizedQuestionsSets < 2 ? 2 : testFormData?.countRandomizedQuestionsSets}
                                        className={cls.settingsInput}
                                        type={"number"}
                                        placeholder={"Укажите количество вариантов"}
                                        onChange={(e) => {
                                            const countRandomizedQuestionsSets = Number(e.target.value);
                                            const validatedRandomizedQuestionsSetsCount =
                                                countRandomizedQuestionsSets === 0 || countRandomizedQuestionsSets < 2 ? 2 : countRandomizedQuestionsSets;
                                            setTestFormData((prev) => ({
                                                ...prev,
                                                countRandomizedQuestionsSets: validatedRandomizedQuestionsSetsCount,
                                                randomizedQuestionsSets: createRandomizedQuestionsSets(testFormData.questions.length, validatedRandomizedQuestionsSetsCount),
                                            }));
                                        }}
                                    />
                                </div>
                            )}

                            {testFormData && (
                                <div className={cls.settingInline}>
                                    <input
                                        checked={testFormData.isQuestionsRandomized}
                                        type="checkbox"
                                        className={cls.settingCheckbox}
                                        name={"isQuestionsRandomized"}
                                        onChange={(e) => {
                                            setTestFormData((prev) => ({
                                                ...prev,
                                                isQuestionsRandomized: e.target.checked,
                                                randomizedQuestionsSets: e.target.checked ? createRandomizedQuestionsSets(testFormData.questions.length) : [],
                                            }));
                                        }}
                                    />
                                    <label htmlFor={"isQuestionsRandomized"} className={cls.settingLabel}>
                                        Показывать вопросы в тесте в случайном порядке?
                                    </label>
                                </div>
                            )}

                            {testFormData && (
                                <div className={cls.settingInline}>
                                    <input
                                        checked={testFormData.isResultVisibleAfterDeadline}
                                        type="checkbox"
                                        className={cls.settingCheckbox}
                                        name={"isResultVisibleAfterDeadline"}
                                        onChange={(e) => {
                                            setTestFormData((prev) => ({
                                                ...prev,
                                                isResultVisibleAfterDeadline: e.target.checked,
                                            }));
                                        }}
                                    />
                                    <label htmlFor={"isResultVisibleAfterDeadline"} className={cls.settingLabel}>
                                        Показывать студенту результат теста только после истечения срока сдачи?
                                    </label>
                                </div>
                            )}
                        </div>
                    </Container>
                </TabPanel>
            </div>
        );
    }
    return <Loader/>;
});

export default TestEditPage;
