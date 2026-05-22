import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type HashKey = "md5" | "sha1" | "sha128" | "sha224" | "sha256" | "sha384" | "sha512";
type WordWrap = "on" | "off";
type LineNumbers = "on" | "off";

export type HashResult = Record<HashKey, string>;

interface EditorOptions {
  fontSize: number;
  wordWrap: WordWrap;
  lineNumbers: LineNumbers;
}

const INITIAL_HASH_RESULTS: HashResult = {
  md5: "",
  sha1: "",
  sha128: "",
  sha224: "",
  sha256: "",
  sha384: "",
  sha512: "",
};

interface HashGeneratorStore {
  inputText: string;
  hashResults: HashResult;
  editorOptions: EditorOptions;
  setInputText: (text: string) => void;
  setHashResults: (results: HashResult) => void;
  clearInput: () => void;
  clearOutput: () => void;
  setEditorOptions: (options: Partial<EditorOptions>) => void;
}

const useHashGeneratorStore = create<HashGeneratorStore>()(
  devtools(
    persist(
      (set): HashGeneratorStore => ({
        inputText: "",
        hashResults: INITIAL_HASH_RESULTS,
        editorOptions: {
          fontSize: 13,
          wordWrap: "on",
          lineNumbers: "off",
        },
        setInputText: (text) => set({ inputText: text }),
        setHashResults: (results) => set({ hashResults: results }),
        clearInput: () => set({ inputText: "" }),
        clearOutput: () => set({ hashResults: INITIAL_HASH_RESULTS }),
        setEditorOptions: (options) =>
          set((state) => ({
            editorOptions: { ...state.editorOptions, ...options },
          })),
      }),
      {
        name: "hash-generator-store",
        partialize: (state) => ({
          editorOptions: state.editorOptions,
        }),
      },
    ),
    { name: "hash-generator", enabled: true },
  ),
);

export default useHashGeneratorStore;
