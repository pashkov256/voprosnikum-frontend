import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "app/providers/StoreProvider/config/slices/auth";
import {useDispatch} from "react-redux";
import {testApi} from "entities/Test/model/slice/testSlice";
import {groupApi} from "entities/Group/model/slice/groupSlice";
import {userApi} from "entities/User/model/slice/userSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        [testApi.reducerPath]: testApi.reducer,
        [groupApi.reducerPath]: groupApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(testApi.middleware,groupApi.middleware,userApi.middleware)
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
