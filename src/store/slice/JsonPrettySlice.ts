import { PayloadAction, combineReducers, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store';


type JsonTextInputState = {
    input: any;
}

type JsonTextOutputState = {
    output: any;
}



const initialInputValue: JsonTextInputState = {
    input: undefined
}

const initialOutputValue: JsonTextOutputState = {
    output: undefined
}

const jsonPrettyInputSlice = createSlice({
    name: 'jsonPrettyInput',
    initialState: initialInputValue,
    reducers: {
        inputData: (state: JsonTextInputState, action: PayloadAction<{ input: any }>) => {
            return action.payload;
        },
    }
});

const jsonPrettyOutputSlice = createSlice({
    name: 'jsonPrettyOutput',
    initialState: initialOutputValue,
    reducers: {
        outputData: (state: JsonTextOutputState, action: PayloadAction<{ output: any }>) => {
            return action.payload;
        }
    }
});


export const { inputData } = jsonPrettyInputSlice.actions;
export const { outputData } = jsonPrettyOutputSlice.actions;
export const jsonPrettyInputSelector = (store: RootState) => store.jsonPrettyInputReducer;
export const jsonPrettyOutputSelector = (store: RootState) => store.jsonPrettyOutputReducer;
export default combineReducers({
    input: jsonPrettyInputSlice.reducer,
    output: jsonPrettyOutputSlice.reducer
})
