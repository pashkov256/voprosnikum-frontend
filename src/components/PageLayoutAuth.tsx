import React from "react";
import { UserContext, UserProvider } from "../context/UserContext";
import Header from "./Header/Header";
export interface PageLayoutAuthProps {
    children: React.ReactNode;
    haveBorder?: boolean;
}

function PageLayoutAuth(props: PageLayoutAuthProps) {
    const {haveBorder = true} = props
    return (
        <UserProvider>
            <Header haveBorder={haveBorder}/>
            {props.children}
        </UserProvider>
    );
}

export default PageLayoutAuth;
