import { PayloadAction, createSlice, combineReducers } from '@reduxjs/toolkit';

import { RootState } from './../store';

type ProvinceState = {
    id: string,
    name_th: string,
    name_en: string
}


export interface IProvince { 
    id: string,
    name_th: string,
    name_en: string
}

const initialValueProvince: ProvinceState = {
    id: '',
    name_th: '',
    name_en: ''
}


const provinceSlice = createSlice({
    name: 'province',
    initialState: initialValueProvince,
    reducers: {
        
    }
});