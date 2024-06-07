import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


type DiffState = {
    addedCount: number;
    removeCount: number;
    firstDiff: Record<string, any>;
    secondDiff: Record<string, any>;
    setAddedCount: (added: number) => void;
    setRemoveCount: (remove: number) => void;
    setFirstDiff: (first: any) => void;
    setSecondDiff: (second: any) => void;
}


const useDiffStore = create<DiffState>()(
    devtools(
        (set) => ({
            addedCount: 0,
            removeCount: 0,
            firstDiff: {},
            secondDiff: {},
            setAddedCount: (added) => set(() => ({ addedCount: added }), false, 'added'),
            setRemoveCount: (remove) => set(() => ({ removeCount: remove }), false, 'remove'),
            setFirstDiff: (first) => set(() => ({ firstDiff: first }), false, 'firstDiff'),
            setSecondDiff: (second) => set(() => ({ secondDiff: second }), false, 'secondDiff')
        }),
        {
            name: 'diffStore',
            serialize: true
        }
    )
);

export default useDiffStore;