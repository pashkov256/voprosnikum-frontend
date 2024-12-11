import {classNames} from 'shared/lib/classNames/classNames';
import cls from './GroupCard.module.scss';
import {Link} from "react-router-dom";
import {CLIENT_PROD_URL, SERVER_URL} from "shared/const/const";

interface GroupCardProps {
    className?: string;
    name:string;
    _id:string;
}

export const GroupCard = (props: GroupCardProps) => {
    const {className,name,_id} = props
    return (
        <Link to={`${CLIENT_PROD_URL}/group/${_id}`} className={classNames(cls.GroupCard, {}, [className])}>{name}</Link>
    )

};
