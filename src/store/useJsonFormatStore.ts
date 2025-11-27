import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IJsonData {
  json: any;
  text: string;
}

interface JsonFormatStore {
  inputJson: IJsonData;
  outputJson: IJsonData;
  setInputData: (data: any) => void;
  setOutputData: (data: any) => void;
  getInputData: () => IJsonData;
  getOutputData: () => IJsonData;
}

const useJsonFormatStore = create(
  devtools(
    (set: any, get: any) => ({
      inputJson: { text: "", json: undefined } as IJsonData,
      outputJson: { text: "", json: undefined } as IJsonData,
      setInputData: (data: IJsonData) => set({ inputJson: data }),
      setOutputData: (data: IJsonData) => set({ outputJson: data }),
      getInputData: () => get().inputJson,
      getOutputData: () => get().outputJson,
    }),
    { name: "json-format", enabled: true }
  )
);

export default useJsonFormatStore;
