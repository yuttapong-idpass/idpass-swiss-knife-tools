import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface JwtStore {
  encodedTextArea: string;
  resultDecodedHeadersArea: any;
  resultDecodedPayloadArea: any;
  secretHeaderArea: string;
  secretKeyArea: string;
  payloadArea: any;
  resultEncodedTextArea: string;
  setEncodeTextArea: (data: string) => void;
  setResultDecodedHeadersArea: (data: any) => void;
  setResultDecodedPayloadArea: (data: any) => void;
  setSecretHeaderArea: (data: string) => void;
  setSecretKeyArea: (data: string) => void;
  setPayloadArea: (data: any) => void;
  setResultEncodedTextArea: (data: string) => void;
}

const useJwtStore = create<JwtStore>()(
  devtools(
    (set): JwtStore => ({
      encodedTextArea: "",
      resultDecodedHeadersArea: undefined,
      resultDecodedPayloadArea: undefined,
      secretHeaderArea: "",
      secretKeyArea: "",
      payloadArea: undefined,
      resultEncodedTextArea: "",
      setEncodeTextArea: (data) => set({ encodedTextArea: data }),
      setResultDecodedHeadersArea: (data) =>
        set({ resultDecodedHeadersArea: data }),
      setResultDecodedPayloadArea: (data) =>
        set({ resultDecodedPayloadArea: data }),
      setSecretHeaderArea: (data) => set({ secretHeaderArea: data }),
      setSecretKeyArea: (data) => set({ secretKeyArea: data }),
      setPayloadArea: (data) => set({ payloadArea: data }),
      setResultEncodedTextArea: (data) => set({ resultEncodedTextArea: data }),
    }),
    { name: "jwt", enabled: true },
  ),
);

export default useJwtStore;
