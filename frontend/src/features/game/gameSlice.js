import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    amount : null,
    crashArray : [],
    betArray : [],
}

const gameSlice = createSlice({
    name:'game',
    initialState,
    reducers:{
        setAmount:(state,action)=>{
            state.amount = action.payload
        },
        addCrashPoint:(state,action)=>{
            const crash = action.payload;
            const updated = [...state.crashArray];
            if(updated.length >= 50) updated.shift();
            updated.push(crash);
            state.crashArray = updated;
        },
        addBet:(state,action)=>{
          state.betArray.push(action.payload);  
        }
    }
})

export const {
    setAmount,
    setBet,
    setCrashPoint,
    setIsCrashed,
    setIsPlaying,
    setMultiplier,
} = gameSlice.actions

export default gameSlice.reducer