import {classNames} from 'shared/lib/classNames/classNames';
import cls from './Block.module.scss';

interface BlockProps {
    className?: string;
    children: React.ReactNode;
}

export const Block = (props: BlockProps) => {
    const {className,children} = props
    return (
        <div className={classNames(cls.Block, {}, [className])}>
            {children}
        </div>
    )

};
