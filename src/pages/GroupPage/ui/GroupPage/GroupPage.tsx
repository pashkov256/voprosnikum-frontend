import { classNames } from 'shared/lib/classNames/classNames';
import cls from './Group.module.scss';
import { TableStudents } from "pages/GroupPage/ui/TableStudents/TableStudents";
import { useParams } from "react-router-dom";
import { Text, TextSize } from 'shared/ui/Text/Text';
import {
    useAddTeacherToGroupMutation,
    useGetGroupByIdQuery,
    useRemoveTeacherFromGroupMutation
} from "entities/Group/model/slice/groupSlice";
import Loader from "shared/ui/Loader/Loader";
import { useGetTeachersMinimalQuery } from "entities/User/model/slice/userSlice";
import { useState, useEffect } from "react";
import { Select, MenuItem, Chip, InputLabel, FormControl } from '@mui/material';

interface GroupPageProps {
    className?: string;
}

export const GroupPage = (props: GroupPageProps) => {
    const { className } = props;
    const { groupId } = useParams();
    const { isLoading: groupIsLoading, data: groupData, error: groupError } = useGetGroupByIdQuery(groupId || "");
    const { isLoading: teachersIsLoading, data: teachersData, error: teachersError } = useGetTeachersMinimalQuery();
    const [addTeacherToGroup] = useAddTeacherToGroupMutation();
    const [removeTeacherFromGroup] = useRemoveTeacherFromGroupMutation();
    const [selectedNames, setSelectedNames] = useState<string[]>([]);

    // Устанавливаем начальное состояние для выбранных учителей
    useEffect(() => {
        if (groupData && groupData.teachers) {
            const uniqueTeachers = Array.from(new Set(groupData.teachers.map(teacher => teacher.fullName)));
            setSelectedNames(uniqueTeachers);
        }
    }, [groupData]);

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;

        const selectedIds: string[] = typeof value === 'string' ? value.split(',') : value;
        setSelectedNames(selectedIds);

        const currentTeachers = groupData?.teachers.map(teacher => teacher.fullName) || [];

        selectedIds.forEach((teacherName) => {
            const teacher = teachersData?.find(t => t.fullName === teacherName);
            if (teacher) {
                addTeacherToGroup({ groupId:groupId || "", teacherId: teacher._id });
            }
        });

        currentTeachers.forEach((teacherName) => {
            if (!selectedIds.includes(teacherName)) {
                const teacherToRemove = teachersData?.find(t => t.fullName === teacherName);
                if (teacherToRemove) {
                    removeTeacherFromGroup({ groupId:groupId || "", teacherId: teacherToRemove._id });
                }
            }
        });
    };

    if (groupIsLoading || teachersIsLoading) {
        return <Loader />;
    }

    return (
        <div className={classNames(cls.Group, {}, [className])}>
            <div className={cls.GroupBlock}>
                <Text title={`Группа ${groupData?.name || ''}`} size={TextSize.L} />
                <TableStudents groupId={groupId || ""} />
            </div>

            <div className={classNames(cls.addTeachersBlock, {}, [cls.GroupBlock])}>
                <Text title="Преподаватели группы" size={TextSize.L}/>
                {/*<InputLabel id="multiple-names-label">Добавьте преподавателей для группы</InputLabel>*/}
                <Select
                    labelId="multiple-names-label"
                    multiple
                    value={selectedNames}
                    onChange={handleChange}
                    className={cls.select}
                    renderValue={(selected) => (
                        <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </div>
                    )}
                >
                    {/* Пример списка имен */}
                    {(teachersData || []).map(({ fullName }) => (
                        <MenuItem key={fullName} value={fullName}>
                            {fullName}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    );
};
