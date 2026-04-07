import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface XMLToJsonStore {
    xml: string | undefined;
    json: string | undefined;
    setXMLText: (data: string) => void;
    setJSONText: (data: string) => void;
    getXMLText: () => string;
    getJSONText: () => string;
}

const useXMLToJsonStore = create(
    devtools(
        (set: any, get: any): XMLToJsonStore => ({
            xml: undefined,
            json: undefined,
            setXMLText: (data: string) => set({ xml: data }),
            setJSONText: (data: string) => set({ json: data }),
            getXMLText: () => get().xml,
            getJSONText: () => get().json,
        }),
        { name: "xml-to-json", enabled: true }
    )
)

export default useXMLToJsonStore;