import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ReducersMapObject } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

interface StoreProviderProps {
    children: ReactNode;
    store: any;

}

export const StoreProvider = (props: StoreProviderProps) => {
    const {
        children,store
    } = props;

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};
