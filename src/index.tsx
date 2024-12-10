import React from 'react';
import ReactDOM from 'react-dom/client';
import 'app/styles/index.scss';
import App from 'app/App';
import {BrowserRouter} from "react-router-dom";
import store from "app/providers/StoreProvider/config/store";
import {StoreProvider} from "app/providers/StoreProvider";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <StoreProvider store={store}>
            <App/>
        </StoreProvider>
    </BrowserRouter>
);

