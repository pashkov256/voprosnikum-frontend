import { lazy } from 'react';

export const MePageAsync = lazy(
    () => import('./MePage'),
);
