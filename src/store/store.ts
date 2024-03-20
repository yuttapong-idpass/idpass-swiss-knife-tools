import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux";
import counterReducer from './slice/counterSlice';
import base64Reducer from './slice/Base64Slice';
import descriptionReducer from './slice/Base64Slice';
import decodeReducer from './slice/jwtTokenSlice'
import encodeReducer from './slice/jwtTokenSlice'
import provinceReducer from './slice/provinceSlice'
import amphureReducer from './slice/provinceSlice'
import tumbolReducer from './slice/provinceSlice'

const reducer = {
    counterReducer,
    base64Reducer,
    descriptionReducer,
    encodeReducer,
    decodeReducer,
    provinceReducer,
    amphureReducer,
    tumbolReducer
}   


export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development'
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();