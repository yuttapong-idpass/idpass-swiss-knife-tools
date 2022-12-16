import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store';



type CounterState = {
    counter: number;
    loading: boolean;
}

const initialValues: CounterState  = {
    counter: 0,
    loading: false
}


const counterSlice = createSlice({
    name: 'counter',
    initialState: initialValues,
    reducers: {
        increase: (state: CounterState, action: PayloadAction<void>) => { 
           state.counter = state.counter + 1;
        }
    },
    extraReducers: (builder) => { 

    }
})


export const { increase } = counterSlice.actions;
export const counterSelector = (store: RootState) => store.counterReducer;
export default counterSlice.reducer;