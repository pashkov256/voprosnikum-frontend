// import {Input} from "@mui/material";
/* import Button from "@mui/material/Button"; */
import { fetchAuth, selectorIsAuth } from "app/providers/StoreProvider/config/slices/auth";
import { useAppDispatch } from "app/providers/StoreProvider/config/store";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Button } from "shared/ui/Button/Button";
import { Input } from "shared/ui/Input/Input";
import styles from "./Login.module.scss";

const Login = () => {
    document.title = "Авторизация";
    const isAuth = useSelector(selectorIsAuth);
    const [loginFormData,setLoginFormData] = useState({
        login:"",
        password:""
    })




    const dispatch = useAppDispatch();

    const onSubmit = async (values:any) => {
        console.log(values)
            //@ts-ignore
        const data = await dispatch(fetchAuth(values));
    console.log(data)
        if (!data.payload) {
            return alert("Не удалось авторизоваться");
        }

        if ("token" in data.payload) {
            window.localStorage.setItem("token", data.payload.token);
        } else {
            alert("Произошла ошибка");
        }
    };

    if (isAuth) {
        return <Navigate to="/" />;
    }
    return (
        <div className={styles.loginBoxParent}>
            <h5 className={styles.title}>Вход в аккаунт</h5>
            <div className={styles.loginBox}>
                <div className={styles.form}>
                    <div className={styles.inputs}>
                        <Input
                            className={styles.loginInput}
                            placeholder="Укажите логин"
                            onChange={(login)=>{
                                setLoginFormData({...loginFormData,login})
                            }}  
                        />
                        <Input
                            className={styles.loginInput}
                            placeholder="Укажите пароль"
                            onChange={(password)=>{
                                setLoginFormData({...loginFormData,password})
                            }} 
                            type={"password"}
                        />
                    </div>
                    <Button
                        className={styles.loginButton}
                        type={"submit"}
                        onClick={()=>onSubmit(loginFormData)}
                    >
                        Войти
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login
