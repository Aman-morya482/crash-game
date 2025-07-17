import { createSlice } from "@reduxjs/toolkit";

const initialState = {amount : 0,};

const gameSlice = createSlice({
    name:'game',
    initialState,
    reducers:{
        setAmount:(state,action)=>{
            state.amount = action.payload;
        },
        incrementAmount:(state,action)=>{
            state.amount += action.payload;
        },
        decrementAmount:(state,action)=>{
            state.amount -= action.payload;
        }
    }
})

export const {setAmount,incrementAmount,decrementAmount} = gameSlice.actions;
export default gameSlice.reducer;