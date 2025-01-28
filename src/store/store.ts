import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import encodedDecodedReducer from './slice/enCodeSlice';
import jsonPrettyReducer from './slice/jsonPrettySlice';

const reducer = {
    encodedDecodedReducer,
    jsonPrettyReducer
}

export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
