import { lazy } from 'react';

export const TestEditPageAsync = lazy(
    () => import('pages/TestEditPage/ui/TestEditPage/TestEditPage'),
);
