import {classNames} from 'shared/lib/classNames/classNames';
import cls from './TeacherTests.module.scss';
import {ITeacherAndTests} from "entities/User/model/slice/userSlice";
import {Text, TextSize, TextTheme} from "shared/ui/Text/Text";
import {Link} from "react-router-dom";
import {formatDate} from "shared/lib/date";
import {Block} from "shared/ui/Block/Block";
interface TeacherTestsProps {
    className?: string;
    teacherTests: ITeacherAndTests
}

export const TeacherTests = (props: TeacherTestsProps) => {
    const {className,teacherTests} = props;


    return (
        <Block className={classNames(cls.TeachersList, {}, [className])}>
            <Text title={teacherTests.fullName}  size={TextSize.S} className={cls.teacherName}/>
            {teacherTests.tests.length !== 0  ? (<div className={cls.teacherTests}>
                {teacherTests.tests.map((teacherTest) => (
                    <Link to={`/test/${teacherTest._id}`} className={cls.test} target="_blank" key={teacherTest._id}>
                        {/*<MdOutlineQuiz className={cls.testIcon}/>*/}
                            {/*<Link to={`/test/${teacherTest._id}`} className={cls.testLink}>{teacherTest.name}</Link>*/}
                            {/*<Text/>*/}
                            <div className={cls.testDetailsBlock}>
                                <span className={cls.testDetailsTitle}>Название:</span>
                                <span className={cls.testDetailsText}>{teacherTest.name}</span>
                            </div>
                            <div className={cls.testDetailsBlock}>
                                <span className={cls.testDetailsTitle}>Создан:</span>
                                <span className={cls.testDetailsText}>{formatDate(teacherTest.createdAt)}</span>
                            </div>
                            <div className={cls.testDetailsBlock}>
                                <span className={cls.testDetailsTitle}>Лимит по времени:</span>
                                <span className={cls.testDetailsText}>{teacherTest.timeLimit === 0 ? "нет" :  `${teacherTest.timeLimit} мин`}</span>
                            </div>
                            <div className={cls.testDetailsBlock}>
                                <span className={cls.testDetailsTitle}>Вы проходили:</span>
                                <span className={cls.testDetailsText}>{teacherTest.testIsComplete  ? "да" :  "нет"}</span>
                            </div>
                            {teacherTest.deadline &&
                                <div className={cls.testDetailsBlock}>
                                    <span className={cls.testDetailsTitle}>Пройти до:</span>
                                    <span className={cls.testDetailsText}>{formatDate(teacherTest.deadline)}</span>
                                </div>
                            }
                            {/*<div className={cls.testDetailsBlock}>*/}
                            {/*    <h5 className={cls.testDetailsTitle}>Кол-во вопросов:</h5>*/}
                            {/*    <p className={cls.testDetailsText}>{teacherTest.questions.length}</p>*/}
                            {/*</div>*/}
                    </Link>
                ))}
            </div>) : <span className={cls.textError} >У преподавателя нету доступных тестов</span>}
        </Block>
    )

};

