import { lazy } from 'react';

export const TestEditPageAsync = lazy(
    () => import('./TestEditPage'),
);
