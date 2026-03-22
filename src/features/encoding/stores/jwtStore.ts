import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface JwtStore {
  encodedToken: string;
  decodedHeaders: any;
  decodedPayload: any;
  setEncodedToken: (data: string) => void;
  setDecodedHeaders: (data: any) => void;
  setDecodedPayload: (data: any) => void;
  getEncodedToken: () => string;
  getDecodedHeaders: () => any;
  getDecodedPayload: () => any;
}

const useJwtStore = create(
  devtools(
    (set: any, get: any): JwtStore => ({
      encodedToken: "",
      decodedHeaders: undefined,
      decodedPayload: undefined,
      setEncodedToken: (data: string) => set({ encodedToken: data }),
      setDecodedHeaders: (data: any) => set({ decodedHeaders: data }),
      setDecodedPayload: (data: any) => set({ decodedPayload: data }),
      getEncodedToken: () => get().encodedToken,
      getDecodedHeaders: () => get().decodedHeaders,
      getDecodedPayload: () => get().decodedPayload,
    }),
    { name: "jwt", enabled: true },
  ),
);

export default useJwtStore;
