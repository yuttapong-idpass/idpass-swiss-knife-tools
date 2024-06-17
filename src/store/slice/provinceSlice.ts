import { PayloadAction, createSlice, combineReducers } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

type ProvinceState = {
   province: any[]
}

type AmphureState = {
    amphure: any[]
}

type TumbolState = {
    tumbol: any[]
}

export interface IProvince { 
    province: any[]
}

export interface IAmphure { 
    amphure: any[]
}

export interface ITumbol { 
    tumbol: any[]
}

const initialValueProvince: ProvinceState = {
    province: []
}

const initialValueAmphure: AmphureState = {
    amphure: []
}

const initialValueTumbol: TumbolState = {
    tumbol: []
}

const provinceSlice = createSlice({
    name: 'province',
    initialState: initialValueProvince,
    reducers: {
        getAllProvince: (state: ProvinceState, action: PayloadAction<IProvince>) => { 
            return action.payload
        }
    }
});

const amphureSlice = createSlice({
    name: 'amphure',
    initialState: initialValueAmphure,
    reducers: {
        getAllAmphure: (state: AmphureState, action: PayloadAction<IAmphure>) => { 
            return action.payload
        }        
    }
});


const tumbolSlice = createSlice({
    name: 'tumbol',
    initialState: initialValueTumbol,
    reducers: {
        getAllTumbol: (state: TumbolState, action: PayloadAction<ITumbol>) => { 
            return action.payload
        }        
    }
});

export const { getAllProvince } = provinceSlice.actions;
export const { getAllAmphure } = amphureSlice.actions;
export const { getAllTumbol } = tumbolSlice.actions;
export const provinceSelector = (store: RootState ) => store.provinceReducer;
export const amphureSelector = (store: RootState) => store.amphureReducer;
export const tumbolSelector = (store: RootState) => store.tumbolReducer;
export default combineReducers({
    province: provinceSlice.reducer,
    amphure: amphureSlice.reducer,
    tumbol: tumbolSlice.reducer
});