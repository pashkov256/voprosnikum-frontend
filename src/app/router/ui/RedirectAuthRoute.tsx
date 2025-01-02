import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchAuthMe, selectorIsAuth } from "app/providers/StoreProvider/config/slices/auth";
import { RootState } from "app/providers/StoreProvider/config/store";

function RedirectAuthRoute() {
    const isAuth = useSelector(selectorIsAuth);
    const userDataIsLoading = useSelector((state: RootState) => state.auth.status) === "loading";

    if (userDataIsLoading) {
        return <div>Loading...</div>;
    }

    if (isAuth) {
        //@ts-ignore
        return <Navigate to={`/me`} replace />;
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default RedirectAuthRoute;
