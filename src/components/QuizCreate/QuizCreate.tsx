import cls from './QuizCreate.module.scss';
import {Box, Tab, Tabs} from "@mui/material";
import {SyntheticEvent, useState} from "react";

interface QuizCreateProps {
    className?: string;
}
function TabPanel(props:any) {
    const { children, value, index, ...other } = props;

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
export const QuizCreate = (props: QuizCreateProps) => {
    const {className} = props;
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue:any) => {
        setValue(newValue);
    };
    return (
        <div className={cls.QuizCreate}>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Вкладка 1" />
                <Tab label="Вкладка 2" />
                <Tab label="Вкладка 3" />
            </Tabs>
            <TabPanel value={value} index={0}>
                Содержимое Вкладки 1
            </TabPanel>
            <TabPanel value={value} index={1}>
                Содержимое Вкладки 2
            </TabPanel>
            <TabPanel value={value} index={2}>
                Содержимое Вкладки 3
            </TabPanel>
        </div>
    )

};
