import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store';

type Base64State = {
    base64: string;
}


interface IBase64  {
    base64: string
}


const initialValues: Base64State = {
    base64: ''
}

const base64Slice = createSlice({
    name: 'base64',
    initialState: initialValues,
    reducers: {
        base64: (state: Base64State, action: PayloadAction<IBase64>) => { 
            return action.payload
        }
    },
    extraReducers: {
        
    }
});


export const { base64 } = base64Slice.actions;
export const base64Selector = ( store: RootState ) => store.base64Reducer;
export default base64Slice.reducer;