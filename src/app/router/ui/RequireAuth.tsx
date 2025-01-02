import React, {ReactNode} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectorIsAuth} from "app/providers/StoreProvider/config/slices/auth";
import {RoutePath} from "shared/config/routeConfig/routeConfig";

export function RequireAuth({ children }: { children: ReactNode }) {
    const isAuth = useSelector(selectorIsAuth);
    const location = useLocation();
    if (isAuth) {
        return <>{children}</>
    } else {
        return <Navigate replace to={RoutePath.login}  state={{ from: location }}/>;
    }
}
