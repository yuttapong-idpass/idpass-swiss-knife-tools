import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store';



type JsonPrettyState = {
    data: any;
}

interface IJsonPretty {
    data: any;
}

const initialValues: JsonPrettyState = {
    data: undefined
}

const jsonPrettySlice = createSlice({
    name: 'jsonPretty',
    initialState: initialValues,
    reducers: {
        jsonData: (state: JsonPrettyState, action: PayloadAction<IJsonPretty>) => {
            return action.payload;
        },
    }
});

export const { jsonData } = jsonPrettySlice.actions;
export const jsonPrettySelector = (store: RootState) => store.jsonPrettyReducer;
export default jsonPrettySlice.reducer;
