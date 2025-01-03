import React, {ChangeEvent, useEffect, useState} from 'react';
import cls from './QuizFormInput.module.scss'
import {classNames} from "shared/lib/classNames/classNames";
interface QuizFormInputProps {
    value: string;
    onChange: (value: any) => void;
    textSize?:InputTextSize;
    className?:string;
    placeholder?:string;
    style?:any;
}

export enum InputTextSize {
    'MD' = "MD",
    'LG' = "LG",
    'XL' = "XL",
};

const textSizesClasses:Record<InputTextSize,string>={
    [InputTextSize.MD]:cls.textSizeMD,
    [InputTextSize.LG]:cls.textSizeLG,
    [InputTextSize.XL]:cls.textSizeXL,
}

 const QuizFormInput = (props:QuizFormInputProps) => {
    const {value,onChange,textSize = InputTextSize.LG,className,placeholder,style} = props

    const [isEditing, setIsEditing] = useState(false);

    const handleFocus = (e:any) => {

        e.stopPropagation();
        setIsEditing(true);
    };

    const handleBlur = (e:any) => {
        e.stopPropagation();
        setIsEditing(true);
    };



    const handleChange = (e:any) => {
        onChange(e.target.value);
    };


    return (
        <div className={className}>
            {isEditing ? (
                <input
                    className={classNames(cls.input,{},[textSizesClasses[textSize]])}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    placeholder={placeholder}
                    style={style}
                />
            ) : (
                <span className={classNames(cls.span,{},[textSizesClasses[textSize]])} onClick={handleFocus}>{value || 'Нажмите чтобы изменить заголовок опроса'}</span>
            )}
        </div>
    );
};

export default QuizFormInput;
