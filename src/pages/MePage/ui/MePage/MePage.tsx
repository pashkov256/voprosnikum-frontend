import cls from './MePage.module.scss';
import {TableTeachers} from "../TableTeachers/TableTeachers";
import {Text, TextSize} from "shared/ui/Text/Text";
import {GroupList} from "entities/Group/ui/GroupList/GroupList";
import {useAppSelector} from "app/providers/StoreProvider/config/slices/auth";
import {TeachersList} from "../TeachersList/TeachersList";
import {Block} from "shared/ui/Block/Block";
import {TestsFilter} from "entities/Test/ui/TestsFilter/TestsFilter";
import {Container} from "@mui/material";
import {useEffect} from "react";

interface MePageProps {
    className?: string;
}

const MePage = (props: MePageProps) => {
    const userData = useAppSelector((state)=>state.auth.data)
    useEffect(()=>{
        document.title = 'Главная страница'
    },[])
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

export default MePage
