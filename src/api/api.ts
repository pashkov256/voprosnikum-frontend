import axios from "axios";
import {SERVER_URL} from "shared/const/const";

const istance = axios.create({
    baseURL: SERVER_URL,
});

istance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem("token");
    return config;
});

export default istance;
