import { classNames } from 'shared/lib/classNames/classNames';
import cls from './TestsFilter.module.scss';
import { Block } from "shared/ui/Block/Block";
import { Text, TextSize } from "shared/ui/Text/Text";
import { TestList } from "shared/ui/TestList/TestList";
import React from "react";
import meCls from 'pages/MePage/ui/MePage/MePage.module.scss';

interface TestsFilterProps {
    className?: string;
    userData: any;
}

export const TestsFilter = (props: TestsFilterProps) => {
    const { className, userData } = props;
    const [sortGroupBy, setSortGroupBy] = React.useState('all');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortGroupBy(event.target.value);
        console.log(event.target.value)
    };

    return (
        <Block>
            <div className={cls.filterBlock}>
                <Text title={"Ваши тесты"} size={TextSize.L} className={classNames(meCls.meTitle,{},[cls.title])} />
                <div className={cls.selectFormcontrol}>
                    <select
                        value={sortGroupBy}
                        onChange={handleSelectChange}
                        className={cls.select}
                    >
                        <option value="all">Все группы</option>
                        {userData.groupsTeacher.map((group: { _id: string, name: string }) => (
                            <option key={group._id} value={group._id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <TestList userId={userData?._id || ""} sortGroupBy={sortGroupBy} />
        </Block>
    );
};
