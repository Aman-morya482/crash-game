import { configureStore } from "@reduxjs/toolkit";
// import gameReducer from '../features/game/gameSlice';
import userReducer from '../features/game/userSlice'
// import { loadState,saveState } from "../utils/localStorage";

export const store = configureStore({
    reducer: {
        game: userReducer,
    },
});
