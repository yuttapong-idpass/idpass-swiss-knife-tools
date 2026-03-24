import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Algorithm {
  name: string;
  alg: string;
  typ: string;
  algorithm: string;
}

interface JwtStore {
  encodedText: string;
  decodedHeaders: any;
  decodedText: any;
  secretKey: string;
  algorithm: Algorithm;
  setEncodedText: (data: string) => void;
  setDecodedHeaders: (data: any) => void;
  setDecodedText: (data: any) => void;
  setSecretKey: (data: string) => void;
  setAlgorithm: (data: Algorithm) => void;
  getEncodedToken: () => string;
  getDecodedHeaders: () => any;
  getDecodedPayload: () => any;
}

const useJwtStore = create(
  devtools(
    (set: any, get: any): JwtStore => ({
      encodedText: "",
      decodedHeaders: undefined,
      decodedText: undefined,
      secretKey: "",
      algorithm: { name: "", alg: "", typ: "", algorithm: "" },
      setEncodedText: (data: string) => set({ encodedText: data }),
      setDecodedHeaders: (data: any) => set({ decodedHeaders: data }),
      setDecodedText: (data: any) => set({ decodedText: data }),
      setSecretKey: (data: string) => set({ secretKey: data }),
      setAlgorithm: (data: Algorithm) => set({ algorithm: data }),
      getEncodedToken: () => get().encodedToken,
      getDecodedHeaders: () => get().decodedHeaders,
      getDecodedPayload: () => get().decodedPayload,
    }),
    { name: "jwt", enabled: true },
  ),
);

export default useJwtStore;
