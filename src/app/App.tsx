import { Container } from "@mui/material";
import { fetchAuthMe, selectorInited, selectorIsAuth } from "app/providers/StoreProvider/config/slices/auth";
import { useAppDispatch } from "app/providers/StoreProvider/config/store";
import AuthRoute from "components/AuthRoute";
import Header from "components/Header/Header";
import PageLayoutAuth from "components/PageLayoutAuth";
import Quiz from "components/Quiz/Quiz";
import { QuizEdit } from "components/QuizEdit/QuizEdit";
import RedirectAuthRoute from "components/RedirectAuthRoute";
import { GroupPage } from "pages/GroupPage";
import Login from "pages/Login/Login";
import { Me } from "pages/Me/ui/Me/Me";
import { Registration } from "pages/Registration/ui/Registration";
import { Test } from "pages/Test/Test";
import TestEdit from "pages/TestEdit/TestEdit";
import { User } from "pages/User/User";
import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Loader from "shared/ui/Loader/Loader";
function App() {
    const dispatch = useAppDispatch();
    const _inited = useSelector(selectorInited);
    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);
    return (
        <>
            {_inited ?  <Suspense fallback="">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <>
                                <Header/>
                                <Login/>
                            </>

                        }
                    />
                    <Route
                        path="/user/:userId"
                        element={
                            <PageLayoutAuth>
                                <Container maxWidth="xl">
                                    <User/>
                                </Container>
                            </PageLayoutAuth>

                        }
                    />
                    <Route
                        path="/me"
                        element={
                            <AuthRoute>
                                    <Header/>
                                    <Me/>
                            </AuthRoute>

                        }
                    />
                    <Route
                        path="/group/:groupId"
                        element={
                            <AuthRoute>
                                    <Header/>
                                    <GroupPage/>
                            </AuthRoute>

                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <>
                                <Header/>
                                <Container maxWidth="lg">
                                    <Registration/>
                                </Container></>

                        }
                    />
                    <Route
                        path="/test/:testId"
                        element={
                            <PageLayoutAuth>
                                    <Test/>
                            </PageLayoutAuth>
                        }
                    />
                    <Route
                        path="/quiz/:quizId/edit"
                        element={
                            <PageLayoutAuth haveBorder={false}>
                                <QuizEdit/>
                            </PageLayoutAuth>

                        }
                    />
                    <Route
                        path="/test/create"
                        element={
                            <PageLayoutAuth haveBorder={false}>
                                <TestEdit/>
                            </PageLayoutAuth>

                        }
                    />
                    <Route
                        path="/test/:id/edit"
                        element={
                            <PageLayoutAuth haveBorder={false}>
                                <TestEdit/>
                            </PageLayoutAuth>

                        }
                    />

                    <Route
                        path="/" element={<RedirectAuthRoute/>}
                    />

                    <Route
                        path="*"
                        element={
                            <PageLayoutAuth>
                                <Container maxWidth="lg" style={{textAlign:'center'}}>
                                    <span style={{fontSize:'72px',fontWeight:"700"}}>404</span>
                                </Container>
                            </PageLayoutAuth>
                        }
                    />
                </Routes>
            </Suspense> : <Loader/>}
        </>
    );
}

export default App;
