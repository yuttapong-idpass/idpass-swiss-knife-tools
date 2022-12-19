import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store';



type JsonPrettyState = {
    json: object;
} 

interface IJsonPretty { 
    json: object;
}

const initialValues: JsonPrettyState = {
    json: {}
}

const jsonPrettySlice = createSlice({
    name: 'jsonPretty',
    initialState: initialValues,
    reducers: {
        inputJson: (state: JsonPrettyState, action: PayloadAction<IJsonPretty>) => { 
            state = action.payload
        }
    }
});

export const { inputJson } = jsonPrettySlice.actions;
export const jsonPrettySelector =  ( store: RootState ) => store.jsonPrettyReducer;
export default jsonPrettySlice.reducer;
