import { createSlice } from "@reduxjs/toolkit";
import { clearSession, isSessionExpired } from "../../utils/SessionManager";

let userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
let token = localStorage.getItem("token") || null;

if(isSessionExpired(userData)){
    clearSession();
    userData = null;
    token = null;
}

const initialState = {
    user: userData,
    token: token,
    amount: userData?.amount || 0,
    isAuthenticated: false,
}

const userSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setAmount: (state, action) => {
            state.amount = action.payload;
            if(state.user){
                state.user.amount = action.payload;
                localStorage.setItem("user",JSON.stringify(state.user));
            }
        },
        incrementAmount: (state, action) => {
            state.amount += action.payload;
            if(state.user){
                state.user.amount += action.payload;
                localStorage.setItem("user",JSON.stringify(state.user));
            }
        },
        decrementAmount: (state, action) => {
            state.amount -= action.payload;
            if(state.user){
                state.user.amount -= action.payload;
                localStorage.setItem("user",JSON.stringify(state.user));
            }
        },
        addExp:(state,action)=>{
            state.user.expPoint += action.payload;
            localStorage.setItem("user", JSON.stringify(state.user));
        },
        decExp:(state,action)=>{
            state.user.expPoint -= action.payload;
            localStorage.setItem("user", JSON.stringify(state.user));
        },
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem('token', token);
        },
        logoutUser: (state, action) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
})

export const { setCredentials, logoutUser } = userSlice.actions;
export const { setAmount, incrementAmount, decrementAmount, addExp, decExp } = userSlice.actions;
export default userSlice.reducer;