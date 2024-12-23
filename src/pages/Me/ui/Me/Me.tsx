import cls from 'pages/Me/ui/Me/Me.module.scss';
import {TableTeachers} from "pages/Me/ui/TableTeachers/TableTeachers";
import {Text, TextSize} from "shared/ui/Text/Text";
import {GroupList} from "entities/Group/ui/GroupList/GroupList";
import {useSelector} from "react-redux";
import {useAppSelector} from "app/providers/StoreProvider/config/slices/auth";
import {QuizCardList} from "components/QuizCardList/QuizCardList";
import {TeachersList} from "pages/Me/ui/TeachersList/TeachersList";
import { TestList } from 'shared/ui/TestList/TestList';
import {Block} from "shared/ui/Block/Block";
import {TestsFilter} from "entities/Test/ui/TestsFilter/TestsFilter";
import {Container} from "@mui/material";

interface UserProps {
    className?: string;
}

export const Me = (props: UserProps) => {
    const { className } = props;
    const userData = useAppSelector((state)=>state.auth.data)
    return (
        <Container maxWidth="xl" className={cls.meContainer}>
            <div className={cls.Me}>
                {
                    //@ts-ignore
                    userData.role !== "student" ? <>
                            <Block>
                                <div>
                                    <Text title={"Группы"} size={TextSize.L} className={cls.meTitle}/>
                                    <GroupList/>
                                </div>
                            </Block>

                            {  //@ts-ignore
                                userData.role === "teacher" &&
                                //@ts-ignore
                                <TestsFilter userData={userData} userId={userData?._id || ""}/>
                            }

                            {  //@ts-ignore
                                userData.role === "admin" &&
                                <Block>
                                    <Text title={"Список преподавателей"} size={TextSize.L} className={cls.meTitle}/>
                                    <TableTeachers/>
                                </Block>
                            }

                        </>
                        :
                        <>
                            <TeachersList/>
                        </>
                }
            </div>
        </Container>

    )

};


