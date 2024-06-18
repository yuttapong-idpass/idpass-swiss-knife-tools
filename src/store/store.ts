import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import encodedDecodedReducer from './slice/enCodeSlice';

const reducer = {
    encodedDecodedReducer
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
