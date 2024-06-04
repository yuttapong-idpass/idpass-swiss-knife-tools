import { create } from 'zustand';


type CounterState = {
    counter: number;
    increment: () => void;
    decrement: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
   counter: 0,
   increment: () => set((state) => ({ counter: state.counter + 1 })),
   decrement: () => set((state) => ({ counter: state.counter - 1 })) 
}));


export default useCounterStore;