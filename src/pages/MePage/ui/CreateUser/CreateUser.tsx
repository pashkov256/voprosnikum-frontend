import { classNames } from 'shared/lib/classNames/classNames';
import cls from './CreateUser.module.scss';

interface CreateUserProps {
    className?: string;
}

export const CreateUser = (props: CreateUserProps) => {
    const { className } = props
    return (
    <div className={classNames(cls.CreateUser, {}, [className])} />
    )

};
