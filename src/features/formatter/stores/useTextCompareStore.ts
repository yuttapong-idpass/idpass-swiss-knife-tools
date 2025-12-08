import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TextCompareStore {
    originalText: string;
    modifiedText: string;
    setOriginalText: (data: string) => void;
    setModifiedText: (data: string) => void;
    getOriginalText: () => string;
    getModifiedText: () => string;
}


const useTextCompareStore = create(
    devtools(
        (set: any, get: any): TextCompareStore => ({
            originalText: "",
            modifiedText: "",
            setOriginalText: (data: string) => set({ originalText: data }),
            setModifiedText: (data: string) => set({ modifiedText: data }),
            getOriginalText: () => get().originalText,
            getModifiedText: () => get().modifiedText,
        }),
        { name: "text-compare", enabled: true }
    )
);

export default useTextCompareStore;
