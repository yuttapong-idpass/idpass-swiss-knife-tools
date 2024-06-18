import { PayloadAction, createSlice, combineReducers } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

// type jwtTokenState = {
//     encode: string;
//     decode: string;
//     isError: boolean;
//     messageError: any;
// }

// interface IJwtToken {
//     encode: string;
//     decode: string;
//     isError: boolean;
//     messageError: string;
// }


type EncodeState = {
    result: string | undefined;
    isError?: boolean;
    messageError?: any;
}


type DecodeState = {
    result: {
        algorithm: any,
        decodeText: any
    } | undefined;
    isError?: boolean;
    messageError?: any;
}


export interface IEncode { 
    result: string | undefined;
    isError?: boolean;
    messageError?: any;
}

export interface IDecode { 
    result: {
        algorithm: any,
        decodeText: any
    } | undefined;
    isError?: boolean;
    messageError?: any;
}



const initialValueEncode: EncodeState = {
    result: '',
    isError: false,
    messageError: ''
}

const initialValueDecode: DecodeState = {
    result: {
        algorithm: {},
        decodeText: {}
    },
    isError: false,
    messageError: ''
}

const encodeSlice = createSlice({
    name: 'encodedToken',
    initialState: initialValueEncode,
    reducers: {
        encodeToken: (state: EncodeState, action: PayloadAction<IEncode>) => { 
            return action.payload
        }
    }
});

const decodeSlice = createSlice({
    name: 'decodedToken',
    initialState: initialValueDecode,
    reducers: {
        decodeToken: (state: DecodeState, action: PayloadAction<IDecode>) => { 
            return action.payload
        }
    }
})

export const { encodeToken } = encodeSlice.actions;
export const { decodeToken } = decodeSlice.actions;
export const encodeSelector = ( store: RootState ) => store.encodeReducer;
export const decodeSelector = ( store: RootState ) => store.decodeReducer;
export default combineReducers({
    encoded: encodeSlice.reducer,
    decoded: decodeSlice.reducer
});