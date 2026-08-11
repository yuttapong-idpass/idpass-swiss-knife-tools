import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface JsonFormatStore {
  /** The working document of the JSON formatter, kept as raw text. */
  content: string;
  setContent: (content: string) => void;
  getContent: () => string;
}

const useJsonFormatStore = create<JsonFormatStore>()(
  devtools(
    (set, get) => ({
      content: "",
      setContent: (content: string) => set({ content }),
      getContent: () => get().content,
    }),
    { name: "json-format", enabled: true },
  ),
);

export default useJsonFormatStore;
