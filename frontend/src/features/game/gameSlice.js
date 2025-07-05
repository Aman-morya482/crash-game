import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    amount : null,
    bet : null,
    multiplier: 1.0,
    crashPoint: null,
    isCrashed: false,
    isPlaying: false,
}

const gameSlice = createSlice({
    name:'game',
    initialState,
    reducers:{
        setAmount:(state,action)=>{
            state.amount = action.payload
        },
        setBet:(state,action)=>{
            state.amount = action.payload
        },
        setMultiplier:(state,action)=>{
            state.multiplier = action.payload
        },
        setCrashPoint:(state,action)=>{
            state.crashPoint = action.payload
        },
        setIsCrashed:(state,action)=>{
            state.crashPoint = action.payload
        },
        setIsPlaying:(state,action)=>{
            state.crashPoint = action.payload
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