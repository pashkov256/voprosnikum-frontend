import {fetchAuthMe, selectorInited} from "app/providers/StoreProvider/config/slices/auth";
import {useAppDispatch} from "app/providers/StoreProvider/config/store";
import React, {Suspense, useEffect} from "react";
import {useSelector} from "react-redux";
import Loader from "shared/ui/Loader/Loader";
import {AppRouter} from "app/router";

function App() {
    const dispatch = useAppDispatch();
    const _inited = useSelector(selectorInited);
    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);
    return (
        <>
            <Suspense fallback="">
                {_inited ?  <AppRouter/> : <Loader/>}
            </Suspense>
        </>
    );
}

export default App;
