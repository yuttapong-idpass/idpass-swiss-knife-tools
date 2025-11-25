import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useJsonFormatStore = create(devtools((set) => ({
    data: {} as { json: any; text: any },
    setData: (data: any) => set({ data }),
}), { name: "json-format", enabled: true }));

export default useJsonFormatStore;