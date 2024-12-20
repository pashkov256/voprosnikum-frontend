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
import TestEdit from "pages/TestEdit/TestEdit";
import { User } from "pages/User/User";
import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import {Test} from "pages/Test/Test";
function App() {
    const dispatch = useAppDispatch();
    const _inited = useSelector(selectorInited);
    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);
    return (
        <>
            {_inited &&  <Suspense fallback="">
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
                                <Container maxWidth="xl">
                                    <Header/>
                                    <Me/>
                                </Container>
                            </AuthRoute>

                        }
                    />
                    <Route
                        path="/group/:groupId"
                        element={
                            <AuthRoute>
                                <Container maxWidth="xl">
                                    <Header/>
                                    <GroupPage/>
                                </Container>
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
                        path="/quiz/:quizId"
                        element={
                            <PageLayoutAuth>
                                <Container maxWidth="lg"  style={{display:'flex', justifyContent:'center',margin:'auto',paddingTop:"80px"}}>
                                    <Quiz/>
                                </Container>
                            </PageLayoutAuth>
                        }
                    />
                    <Route
                        path="/test/:testId"
                        element={
                            <PageLayoutAuth>
                                <Container maxWidth="lg"  style={{display:'flex', justifyContent:'center',margin:'auto',paddingTop:"120px"}}>
                                    {/* <Test/> */}
                                    <Test/>
                                </Container>
                            </PageLayoutAuth>
                        }
                    />
                    <Route
                        path="/test/:testId"
                        element={
                            <PageLayoutAuth>
                                <Container maxWidth="lg"  style={{display:'flex', justifyContent:'center',margin:'auto',width:'1100px',paddingTop:"80px"}}>
                                    <Quiz/>
                                </Container>
                            </PageLayoutAuth>
                        }
                    />
                    {/*<Route*/}
                    {/*    path="/quiz/:quizId/edit"*/}
                    {/*    element={*/}
                    {/*        <PageLayoutAuth haveBorder={false}>*/}
                    {/*            <QuizEdit/>*/}
                    {/*        </PageLayoutAuth>*/}

                    {/*    }*/}
                    {/*/>*/}
                    {/*<Route*/}
                    {/*    path="/quiz/create"*/}
                    {/*    element={*/}
                    {/*        <PageLayoutAuth haveBorder={false}>*/}
                    {/*            <QuizEdit/>*/}
                    {/*        </PageLayoutAuth>*/}

                    {/*    }*/}
                    {/*/>  */}
                    <Route
                        path="/quiz/:quizId/edit"
                        element={
                            <PageLayoutAuth haveBorder={false}>
                                <QuizEdit/>
                            </PageLayoutAuth>

                        }
                    />
                    <Route
                        path="/quiz/create"
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
            </Suspense>}
        </>
    );
}

export default App;
