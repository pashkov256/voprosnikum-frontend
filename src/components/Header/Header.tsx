import cls from './Header.module.scss';
import {Link, useNavigate} from "react-router-dom";
import {Container} from "@mui/material";
import {useContext, useState} from "react";
import {UserContext} from "../../context/UserContext";
import { FaUserCircle } from "react-icons/fa";
import {useSelector} from "react-redux";
import {selectorIsAuth} from "app/providers/StoreProvider/config/slices/auth";
interface HeaderProps {
    className?: string;
    haveBorder?: boolean;
}

const Header = (props: HeaderProps) => {
    const {haveBorder = true} = props
    const isAuth = useSelector(selectorIsAuth);
    console.log(isAuth)
    const navigate = useNavigate();
    return (
        <div className={cls.root} style={haveBorder ? {borderBottom: "2px solid #f4f4f6"}:{}}>
            <Container maxWidth="lg">
                <div className={cls.inner}>
                    <Link className={cls.logo} to="/me">
                        ВОПРОСНИКУМ
                    </Link>
                    <div className={cls.rightContent}>
                        {isAuth ? <>
                            <span className={cls.link} onClick={()=>{
                                localStorage.removeItem("token");
                                window.location.reload()
                            }}>Выйти</span>
                            <Link to={`/me`}>
                                <FaUserCircle size={"36px"}  className={cls.iconUser} fill={"#222"}/>
                            </Link>
                       </> : (
                            <>
                                {/* <Link to="/login" className={cls.link}>
                                    Войти
                                </Link> */}
                                {/*<Link to="/register" className={cls.link}>*/}
                                {/*    Создать аккаунт*/}
                                {/*</Link>*/}
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Header;
