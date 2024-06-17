import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState} from '../store';


type EncodedDecodedState = {
    encoded: string
    decoded: string
}

const initialEncodedDecoded: EncodedDecodedState = {
    encoded: '',
    decoded: ''
}

const urlEncodedDecoded = createSlice({
    name: 'URLEncodedDecoded',
    initialState:  initialEncodedDecoded,
    reducers: {
        encoded: (state: EncodedDecodedState, action: PayloadAction<EncodedDecodedState>) => { 
            return action.payload;   
        },
        decoded: (state: EncodedDecodedState, action: PayloadAction<EncodedDecodedState>) => { 
            return action.payload;   
        }
    }
});

export const { encoded, decoded } = urlEncodedDecoded.actions;
export const encodedDecodedSelector = (store: RootState) => store.encodedDecodedReducer;
export default urlEncodedDecoded.reducer; 


