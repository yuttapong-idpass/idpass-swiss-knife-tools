import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux";
import counterReducer from './slice/counterSlice';
import jsonPrettyReducer from './slice/JsonPrettySlice';
import base64Reducer from './slice/Base64Slice';



const reducer = {
    counterReducer,
    jsonPrettyReducer,
    base64Reducer
}   


export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development'
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();