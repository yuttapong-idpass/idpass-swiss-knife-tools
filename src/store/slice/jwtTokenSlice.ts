import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type jwtTokenState = {
    jwt: string;
    isError: boolean;
    messageError: any;
}

interface IJwtToken {
    jwt: string;
    isError: boolean;
    messageError: string;
}

const initialValues: jwtTokenState = {
    jwt: '',
    isError: false,
    messageError: ''
}

const jwtTokenSlice = createSlice({
    name: 'jwtToken',
    initialState: initialValues,
    reducers: {
        jwtToken: (state: jwtTokenState,action: PayloadAction<IJwtToken>) => { 
            return action.payload
        }
    }
});

export const { jwtToken } = jwtTokenSlice.actions;
export const jwtTokenSelector = ( store: RootState ) => store.jwtTokenReducer;
export default jwtTokenSlice.reducer;