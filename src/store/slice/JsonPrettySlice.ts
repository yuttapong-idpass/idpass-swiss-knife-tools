import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store';



type JsonPrettyState = {
    item: any;
    isError: boolean;
    messageError: any;
}

interface IJsonPretty {
    item: any;
    isError: boolean;
    messageError: string;
}

const initialValues: JsonPrettyState = {
    item: undefined, 
    isError: false,
    messageError: ''
}

const jsonPrettySlice = createSlice({
    name: 'jsonPretty',
    initialState: initialValues,
    reducers: {
        inputJson: (state: JsonPrettyState, action: PayloadAction<IJsonPretty>) => {
            return action.payload;
        },
        outputJson: (state: JsonPrettyState, action: PayloadAction<IJsonPretty>) => {
            return action.payload;
        }

    }
});

export const { inputJson, outputJson } = jsonPrettySlice.actions;
export const jsonPrettySelector = (store: RootState) => store.jsonPrettyReducer;
export default jsonPrettySlice.reducer;
