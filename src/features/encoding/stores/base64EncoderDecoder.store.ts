import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Base64EncoderDecoderStore {
  plainText: string;
  encodedText: string;
  setPlainText: (text: string) => void;
  setEncodedText: (text: string) => void;
}

const useBase64EncoderDecoderStore = create<Base64EncoderDecoderStore>()(
  devtools(
    (set): Base64EncoderDecoderStore => ({
      plainText: "",
      encodedText: "",
      setPlainText: (text: string) => set({ plainText: text }),
      setEncodedText: (text: string) => set({ encodedText: text }),
    }),
    { name: "base64-encoder-decoder", enabled: true },
  ),
);

export default useBase64EncoderDecoderStore;
