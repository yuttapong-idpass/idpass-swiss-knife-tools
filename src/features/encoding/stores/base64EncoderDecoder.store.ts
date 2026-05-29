import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Base64EncoderDecoderStore {
  plainText: string;
  encodedText: string;
  usePadding: boolean;
  setPlainText: (text: string) => void;
  setEncodedText: (text: string) => void;
  setUsePadding: (usePadding: boolean) => void;
}

const useBase64EncoderDecoderStore = create<Base64EncoderDecoderStore>()(
  devtools(
    (set): Base64EncoderDecoderStore => ({
      plainText: "",
      encodedText: "",
      usePadding: true,
      setPlainText: (text: string) => set({ plainText: text }),
      setEncodedText: (text: string) => set({ encodedText: text }),
      setUsePadding: (usePadding: boolean) => set({ usePadding }),
    }),
    { name: "base64-encoder-decoder", enabled: true },
  ),
);

export default useBase64EncoderDecoderStore;
