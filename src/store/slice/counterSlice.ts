import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store';



type CounterState = {
    counter: number;
    loading: boolean;
}

const initialValues: CounterState  = {
    counter: 0,
    loading: false
}


export const setValueAsync = createAsyncThunk("counter/setValueAsync", async(value: number) => { 
    const job = new Promise<number>((resolve, reject) => { 
        setTimeout(() => { 
            if (value >= 0) { 
                resolve(value);
            } else { 
                reject(Error(''));
            }
        }, 1000);
    });
  return await job;
})
//example 
const counterSlice = createSlice({
    name: 'counter',
    initialState: initialValues,
    reducers: {
        increase: (state: CounterState, action: PayloadAction<void>) => { 
           state.counter = state.counter + 1;
        }
    },
    extraReducers: (builder) => { 
        //success
        builder.addCase(setValueAsync.fulfilled, (state, action) => {
            state.counter = action.payload;
        });

        builder.addCase(setValueAsync.pending, (state, action) => {
            state.counter = 0;
        })



    }
})


export const { increase } = counterSlice.actions;
export const counterSelector = (store: RootState) => store.counterReducer;
export default counterSlice.reducer;