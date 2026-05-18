import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TransformMode = "encrypt" | "decrypt";
type Algorithm = "AES";
type AesMode = "CBC" | "GCM" | "CTR";
type WordWrap = "on" | "off";
type LineNumbers = "on" | "off";

interface EditorOptions {
  fontSize: number;
  wordWrap: WordWrap;
  lineNumbers: LineNumbers;
}

interface EncryptDecryptStore {
  plainText: string;
  encryptedText: string;
  transformMode: TransformMode;
  algorithm: Algorithm;
  aesMode: AesMode;
  passphrase: string;
  salt: string;
  iv: string;
  editorOptions: EditorOptions;
  setPlainText: (text: string) => void;
  setEncryptedText: (text: string) => void;
  setTransformMode: (mode: TransformMode) => void;
  setAlgorithm: (algorithm: Algorithm) => void;
  setAesMode: (mode: AesMode) => void;
  setPassphrase: (passphrase: string) => void;
  setSalt: (salt: string) => void;
  setIv: (iv: string) => void;
  setEditorOptions: (options: Partial<EditorOptions>) => void;
}

const useEncryptDecryptStore = create<EncryptDecryptStore>()(
  devtools(
    persist(
      (set): EncryptDecryptStore => ({
        plainText: "",
        encryptedText: "",
        transformMode: "encrypt",
        algorithm: "AES",
        aesMode: "CBC",
        passphrase: "",
        salt: "",
        iv: "",
        editorOptions: {
          fontSize: 13,
          wordWrap: "on",
          lineNumbers: "off",
        },
        setPlainText: (text) => set({ plainText: text }),
        setEncryptedText: (text) => set({ encryptedText: text }),
        setTransformMode: (mode) => set({ transformMode: mode }),
        setAlgorithm: (algorithm) => set({ algorithm }),
        setAesMode: (mode) => set({ aesMode: mode }),
        setPassphrase: (passphrase) => set({ passphrase }),
        setSalt: (salt) => set({ salt }),
        setIv: (iv) => set({ iv }),
        setEditorOptions: (options) =>
          set((state) => ({
            editorOptions: { ...state.editorOptions, ...options },
          })),
      }),
      {
        name: "encrypt-decrypt-store",
        partialize: (state) => ({
          transformMode: state.transformMode,
          algorithm: state.algorithm,
          aesMode: state.aesMode,
          editorOptions: state.editorOptions,
        }),
      },
    ),
    { name: "encrypt-decrypt", enabled: true },
  ),
);

export default useEncryptDecryptStore;
