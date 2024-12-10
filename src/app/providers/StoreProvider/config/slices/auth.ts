import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from 'api/api'
import {RootState} from "app/providers/StoreProvider/config/store";
import {UserData} from "model/IUser";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
    const {data} = await axios.post("/auth/login", params);
    return data;
});
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
    const {data} = await axios.get("/auth/me");
    return data;
});
export const fetchRegister = createAsyncThunk(
    "auth/fetchRegister",
    async (params) => {
        //@ts-ignore
        const {data} = await axios.post("/auth/register", {...params,role:"teacher"});
        return data;
    }
);

const initialState = {
    data: null,
    status: "loading",
    _inited: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.data = null;
                state.status = "loading";
            })
            .addCase(fetchAuth.fulfilled, (state,action) => {
                state.data = action.payload;
                state.status = "loaded";
            })
            .addCase(fetchAuth.rejected, (state, action) => {
                state.data = null;
                state.status = "error";
            })

            .addCase(fetchAuthMe.pending, (state) => {
                state.data = null;
                state.status = "loading";
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.data = action.payload;
                   state._inited = true;
                state.status = "loaded";
            })
            .addCase(fetchAuthMe.rejected, (state, action) => {
                state.data = null;
                   state._inited = true;
                state.status = "error";
            })

            .addCase(fetchRegister.pending, (state) => {
                state.data = null;
                state.status = "loading";
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = "loaded";
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.data = null;
                state.status = "error";
            });
    },

});

export const selectorIsAuth = (state:RootState) => Boolean(state.auth.data);
export const selectorInited = (state:RootState) => Boolean(state.auth._inited);

export const authReducer = authSlice.reducer;
export const {logout} = authSlice.actions;
