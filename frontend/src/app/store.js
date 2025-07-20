import { configureStore } from "@reduxjs/toolkit";
import gameReducer from '../features/game/gameSlice';
import { loadState,saveState } from "../utils/localStorage";

const persistedState = loadState();

export const store = configureStore({
    reducer:{
        game:gameReducer,
    },
    preloadedState:{
        game: persistedState || {amount : 0},
    },
});

store.subscribe(()=>{
    saveState(store.getState().game);
})