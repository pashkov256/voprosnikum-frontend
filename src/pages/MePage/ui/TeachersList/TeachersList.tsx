import {classNames} from 'shared/lib/classNames/classNames';
import cls from './TeachersList.module.scss';
import {useGetTeacherAndTestsQuery} from "entities/User/model/slice/userSlice";
import Loader from "shared/ui/Loader/Loader";
import {Text, TextSize, TextTheme} from "shared/ui/Text/Text";
import {TeacherTests} from "../TeacherTests/TeacherTests";
import {Block} from "shared/ui/Block/Block";
import clsMe from '../MePage/MePage.module.scss'
interface TeachersListProps {
    className?: string;
}

export const TeachersList = (props: TeachersListProps) => {
    const {className} = props;
    const {data:teachersAndTestsData,isLoading:teacherAndTestsIsLoading} = useGetTeacherAndTestsQuery()
    console.log(teachersAndTestsData)
    if(teacherAndTestsIsLoading){
        return <Loader />
    }

    return (
        <div className={classNames(cls.TeachersList, {}, [className])}>
            {(teachersAndTestsData?.teachers || 0) !== 0 ? <>
                <Text title={"Тесты преподавателей"}  size={TextSize.L} className={classNames(clsMe.meTitle,{},[cls.title])}/>
                {(teachersAndTestsData?.teachers || []).map((teacherTests)=> {
                    return <TeacherTests key={teacherTests._id} teacherTests={teacherTests}/>
                })}
            </> : <h3 style={{textAlign:"center"}}>На данный момент у вас нет преподавателей</h3>}
        </div>
    )

};
