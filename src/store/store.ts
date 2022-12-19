import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux";
import counterReducer from './slice/counterSlice';
import jsonPrettyReducer from './slice/JsonPrettySlice';




const reducer = {
    counterReducer,
    jsonPrettyReducer
}   


export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development'
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();