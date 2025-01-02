import {RouteProps} from "react-router-dom";
import RedirectAuthRoute from "app/router/ui/RedirectAuthRoute";
import React from "react";
import LoginPage from "pages/LoginPage/ui/LoginPage";
import {MePage} from "pages/MePage";
import Header from "components/Header/Header";
import {GroupPage} from "pages/GroupPage";
import {TestPage} from "pages/TestPage";
import {TestEditPage} from "pages/TestEditPage";
import {Container} from "@mui/material";

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
}

export enum AppRoutes {
    MAIN = 'main',
    LOGIN = 'login',
    ME = 'me',
    GROUP = 'group',
    TEST = 'test',
    TEST_CREATE = 'test_create',
    TEST_EDIT = 'test_edit',
    // last
    NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.ME]: '/me', // + :id
    [AppRoutes.GROUP]: '/group/', // + :groupId
    [AppRoutes.TEST]: '/test', // + :testId
    [AppRoutes.TEST_CREATE]: '/test/create',
    [AppRoutes.TEST_EDIT]: '/test/:id/edit',
    // LAST
    [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <>
            <RedirectAuthRoute/>
        </>,
    },
    [AppRoutes.LOGIN]: {
        path: RoutePath.login,
        element:<>
            <Header/>
            <LoginPage/>
        </>,
    },
    [AppRoutes.ME]: {
        path: RoutePath.me,
        element: <>
            <Header/>
            <MePage/>
        </>,
        authOnly: true,
    },
    [AppRoutes.GROUP]: {
        path: `${RoutePath.group}:groupId`,
        element:  <>
            <Header/>
            <GroupPage/>
        </>,
        authOnly: true,
    },
    [AppRoutes.TEST]: {
        path: `${RoutePath.test}:testId`,
        element: <>
            <Header/>
            <TestPage/>
        </>,
        authOnly: true,
    },
    [AppRoutes.TEST_CREATE]: {
        path: `${RoutePath.test_create}`,
        element: <>
            <Header haveBorder={false}/>
            <TestEditPage/>
        </>,
        authOnly: true,
    },
    [AppRoutes.TEST_EDIT]: {
        path: `${RoutePath.test_edit}`,
        element:<>
            <Header haveBorder={false}/>
            <TestEditPage/>
        </>,
        authOnly: true,
    },
    // last
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element:  <Container maxWidth="lg" style={{textAlign:'center'}}>
            <span style={{fontSize:'72px',fontWeight:"700"}}>404</span>
        </Container>,
    },
};
