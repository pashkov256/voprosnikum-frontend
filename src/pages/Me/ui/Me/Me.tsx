import cls from 'pages/Me/ui/Me/Me.module.scss';
import {TableTeachers} from "pages/Me/ui/TableTeachers/TableTeachers";
import {Text, TextSize} from "shared/ui/Text/Text";
import {GroupList} from "entities/Group/ui/GroupList/GroupList";
import {useSelector} from "react-redux";
import {useAppSelector} from "app/providers/StoreProvider/config/slices/auth";
import {QuizCardList} from "components/QuizCardList/QuizCardList";
import {TeachersList} from "pages/Me/ui/TeachersList/TeachersList";

interface UserProps {
    className?: string;
}

export const Me = (props: UserProps) => {
    const { className } = props;
    const authData = useAppSelector((state)=>state.auth.data)
    return (
        <div className={cls.Me}>
            {
                //@ts-ignore
                authData.role !== "student" ? <>
                        <div className={cls.meBlock}>
                            <div>
                                <Text title={"Группы"} size={TextSize.L} className={cls.meTitle}/>
                                <GroupList/>
                            </div>
                        </div>

                        {  //@ts-ignore
                            authData.role === "teacher" &&
                            <div className={cls.meBlock}>
                                <Text title={"Ваши тесты"} size={TextSize.L} className={cls.meTitle}/>
                                {/*@ts-ignore*/}
                            <QuizCardList  userId={authData._id}/>
                        </div>
                    }

                    {  //@ts-ignore
                        authData.role === "admin" &&
                        <div className={cls.meBlock}>
                            <Text title={"Список преподавателей"} size={TextSize.L} className={cls.meTitle}/>
                            <TableTeachers/>
                        </div>
                    }

                </>
            :
            <>
                <div className={cls.meBlock}>
                    <TeachersList/>
                </div>
            </>
            }


        </div>
    )

};


