import { lazy } from 'react';

export const LoginPageAsync = lazy(
    () => import('pages/LoginPage/ui/LoginPage'),
);
