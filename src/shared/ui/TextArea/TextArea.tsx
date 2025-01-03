import {classNames} from 'shared/lib/classNames/classNames';
import cls from './TextArea.module.scss';
import {memo, TextareaHTMLAttributes} from "react";

interface TextAreaProps extends HTMLTextareaAttributes{
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
}

type HTMLTextareaAttributes = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>,'value'|'onChange'>

export const TextArea = memo((props: TextAreaProps) => {
    const {className,value,placeholder,onChange,...otherProps} = props;

    return (
        <textarea
            className={classNames(cls.TextArea, {}, [className])}
            placeholder={placeholder}
            value={value} {...otherProps}
            onChange={(event)=>{
                onChange?.(event.target.value)
            }}
        />
    )

});
