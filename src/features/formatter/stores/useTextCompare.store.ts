import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TextCompareStore {
    originalText: string;
    modifiedText: string;
    originalName: string;
    modifiedName: string;
    setOriginalText: (data: string) => void;
    setModifiedText: (data: string) => void;
    setOriginalName: (data: string) => void;
    setModifiedName: (data: string) => void;
    getOriginalText: () => string;
    getModifiedText: () => string;
    getOriginalName: () => string;
    getModifiedName: () => string;
}


const useTextCompareStore = create(
    devtools(
        (set: any, get: any): TextCompareStore => ({
            originalText: "",
            modifiedText: "",
            originalName: "",
            modifiedName: "",
            setOriginalText: (data: string) => set({ originalText: data }),
            setModifiedText: (data: string) => set({ modifiedText: data }),
            setOriginalName: (data: string) => set({ originalName: data }),
            setModifiedName: (data: string) => set({ modifiedName: data }),
            getOriginalText: () => get().originalText,
            getModifiedText: () => get().modifiedText,
            getOriginalName: () => get().originalName,
            getModifiedName: () => get().modifiedName,
        }),
        { name: "text-compare", enabled: true }
    )
);

export default useTextCompareStore;
