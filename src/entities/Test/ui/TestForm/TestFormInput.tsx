import React, {ChangeEvent, useEffect, useState} from 'react';
import cls from './TestFormInput.module.scss'
import {classNames} from "shared/lib/classNames/classNames";
interface TestFormInputProps {
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

const TestFormInput = (props:TestFormInputProps) => {
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


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value); // Используем event.target.value
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
                <span className={classNames(cls.span,{},[textSizesClasses[textSize]])} onClick={handleFocus}>{value || placeholder}</span>
            )}
        </div>
    );
};

export default TestFormInput;
