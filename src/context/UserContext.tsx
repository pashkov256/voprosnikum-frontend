import React, {createContext, ReactNode, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";

export interface UserData {
    _id: string;
    fullName: string;
    email: string;
}

export const UserContext = createContext<UserData>({
    _id:"",
    fullName:"",
    email:"",
});

export const UserProvider = ({ children }:{children:ReactNode}) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userDataIsLoading, setUserDataIsLoading] = useState(true);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get<UserData>("/auth/me");
                setUserData(data);
                setUserDataIsLoading(false);
            } catch (error) {
                console.log(error)
                navigate("/login");
            }
        };
        fetchUserData();
    }, []);

    return (
        !userDataIsLoading && userData !== null ? (
            <UserContext.Provider value={userData}>{children}</UserContext.Provider>
        ) : null
    );
};
