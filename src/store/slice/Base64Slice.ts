import { PayloadAction, createSlice, combineReducers } from '@reduxjs/toolkit';

import { RootState } from './../store';

type Base64State = {
    base64: string;
    errorImage: boolean;
}

type DescriptionState = {
    name: string;
    height?: number;
    width?: number,
    size?: number
}

interface IBase64 {
    base64: string;
    errorImage: boolean;
}


export interface IDescription {
    name: string;
    height?: number;
    width?: number,
    size?: number
}


const initialValues: Base64State = {
    base64: '',
    errorImage: false
}

const initialValuesDescription:  DescriptionState = {
    name: '',
    height: 0,
    width: 0,
    size: 0
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


const descriptionSlice = createSlice({
    name: 'description',
    initialState: initialValuesDescription,
    reducers: {
        descriptions: (state: DescriptionState, action: PayloadAction<IDescription>) => { 
            return action.payload
        }
    }
});




export const { base64 } = base64Slice.actions;
export const { descriptions } = descriptionSlice.actions;
export const base64Selector = (store: RootState) => store.base64Reducer;
export const descriptionSelector = (store: RootState) => store.descriptionReducer;
export default combineReducers({
    base64: base64Slice.reducer,
    description: descriptionSlice.reducer
})
