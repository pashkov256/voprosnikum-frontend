import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "app/providers/StoreProvider/config/slices/auth";
import {useDispatch} from "react-redux";
import {testApi} from "entities/Test/model/slice/testSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        [testApi.reducerPath]: testApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(testApi.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
