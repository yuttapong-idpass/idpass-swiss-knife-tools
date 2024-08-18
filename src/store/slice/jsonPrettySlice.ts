import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';


type JsonPrettyState = {
    data: Record<string, any>
}

const initialJsonPrettyState: JsonPrettyState = {
    data: {}
}   

const jsonPretty = createSlice({
    name: 'JsonPretty',
    initialState: initialJsonPrettyState,
    reducers: {
        setJson: (state: JsonPrettyState, action: PayloadAction<JsonPrettyState>) => { 
            return { ...state, data: action.payload }
        },
    }
});

export const { setJson } = jsonPretty.actions;
export const jsonPrettySelector = (store: RootState) => store.jsonPrettyReducer;
export default jsonPretty.reducer;