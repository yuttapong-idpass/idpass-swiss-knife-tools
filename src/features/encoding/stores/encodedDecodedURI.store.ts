import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface EncodedDecodedURIStore {
  encodedText: string;
  decodedText: string;
  setEncodedText: (text: string) => void;
  setDecodedText: (text: string) => void;
}

const useEncodedDecodedURIStore = create<EncodedDecodedURIStore>()(
  devtools(
    (set): EncodedDecodedURIStore => ({
      encodedText: "",
      decodedText: "",
      setEncodedText: (text: string) => set({ encodedText: text }),
      setDecodedText: (text: string) => set({ decodedText: text }),
    }),
    { name: "encoded-decoded-uri", enabled: true },
  ),
);

export default useEncodedDecodedURIStore;
