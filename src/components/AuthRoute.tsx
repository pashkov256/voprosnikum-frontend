import React, {ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectorIsAuth} from "app/providers/StoreProvider/config/slices/auth";

function AuthRoute({ children }: { children: ReactNode }) {
    const isAuth = useSelector(selectorIsAuth);

    if (isAuth) {
        return <>{children}</>
    } else {
        return <Navigate replace to="/login" />;
    }
}

export default AuthRoute;
