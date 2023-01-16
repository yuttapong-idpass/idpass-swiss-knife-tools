import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux";
import counterReducer from './slice/counterSlice';
import jsonPrettyReducer from './slice/JsonPrettySlice';
import base64Reducer from './slice/Base64Slice';
import descriptionReducer from './slice/Base64Slice';
import decodeReducer from './slice/jwtTokenSlice'
import encodeReducer from './slice/jwtTokenSlice'


const reducer = {
    counterReducer,
    jsonPrettyReducer,
    base64Reducer,
    descriptionReducer,
    encodeReducer,
    decodeReducer
}   


export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development'
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();