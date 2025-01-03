import { lazy } from 'react';

export const TestPageAsync = lazy(
    () => import('./TestPage'),
);
