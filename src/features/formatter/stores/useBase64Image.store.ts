import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Base64ImageStore {
  base64: string | undefined;
  imageData: string | undefined;
  setBase64: (data: string) => void;
  setImageData: (data: string) => void;
  getBase64: () => string;
  getImageData: () => string;
}

const useBase64ImageStore = create(
  devtools(
    (set: any, get: any): Base64ImageStore => ({
      base64: undefined,
      imageData: undefined,
      setBase64: (data: string) => set({ base64: data }),
      setImageData: (data: string) => set({ imageData: data }),
      getBase64: () => get().base64,
      getImageData: () => get().imageData,
    }),
    { name: "base64-image", enabled: true },
  ),
);

export default useBase64ImageStore;
