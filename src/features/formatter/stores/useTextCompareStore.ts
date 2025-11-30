import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ITextCompare {
    original: string;
    modified: string;
}

interface TextCompareStore {
    originalText: ITextCompare;
    modifiedText: ITextCompare;
    setOriginalText: (data: ITextCompare) => void;
    setModifiedText: (data: ITextCompare) => void;
    getOriginalText: () => ITextCompare;
    getModifiedText: () => ITextCompare;
}


const useTextCompareStore = create(
    devtools(
        (set: any, get: any): TextCompareStore => ({
            originalText: { original: "", modified: "" },
            modifiedText: { original: "", modified: "" },
            setOriginalText: (data: ITextCompare) => set({ originalText: data }),
            setModifiedText: (data: ITextCompare) => set({ modifiedText: data }),
            getOriginalText: () => get().originalText,
            getModifiedText: () => get().modifiedText,
        }),
        { name: "text-compare", enabled: true }
    )
);

export default useTextCompareStore;
