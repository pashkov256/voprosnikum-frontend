import {classNames} from 'shared/lib/classNames/classNames';
import cls from './TeachersList.module.scss';
import {useGetTeacherAndTestsQuery} from "entities/User/model/slice/userSlice";
import Loader from "shared/ui/Loader/Loader";
import {Text} from "shared/ui/Text/Text";

interface TeachersListProps {
    className?: string;
}

export const TeachersList = (props: TeachersListProps) => {
    const {className} = props;
    const {data:teacherAndTestsData,isLoading:teacherAndTestsIsLoading} = useGetTeacherAndTestsQuery()
    console.log(teacherAndTestsData)
    if(teacherAndTestsIsLoading){
        return <Loader />
    }

    return (
        <div className={classNames(cls.TeachersList, {}, [className])}>
            <Text title={"g"}/>
            {/*{(teacherAndTestsData || []).map((el)=>{*/}

            {/*})}*/}
        </div>
    )

};
