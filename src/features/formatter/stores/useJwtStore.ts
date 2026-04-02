import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface JwtState {
  encodedText: string;
  decodedHeaders: any;
  decodedPayload: any;
  setEncodedText: (data: string) => void;
  setDecodedHeaders: (data: any) => void;
  setDecodedPayload: (data: any) => void;
}

const useJwtStore = create(
  devtools(
    (set: any, get: any): JwtState => ({
      encodedText: "",
      decodedHeaders: undefined,
      decodedPayload: undefined,
      setEncodedText: (data: string) => set({ encodedText: data }),
      setDecodedHeaders: (data: any) => set({ decodedHeaders: data }),
      setDecodedPayload: (data: any) => set({ decodedPayload: data }),
    }),
    { name: "jwt", enabled: true },
  ),
);
