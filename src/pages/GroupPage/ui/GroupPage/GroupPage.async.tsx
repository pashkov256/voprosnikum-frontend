import { lazy } from 'react';

export const GroupPageAsync = lazy(
    () => import('./GroupPage'),
);
