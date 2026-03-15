import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface XMLFormatterStore {
  xml: string | undefined;
  formattedXml: string | undefined;
  setXMLText: (data: string) => void;
  setFormattedXML: (data: string) => void;
  getXMLText: () => string;
  getFormattedXML: () => string;
}

const useXMLFormatterStore = create(
  devtools(
    (set: any, get: any): XMLFormatterStore => ({
      xml: undefined,
      formattedXml: undefined,
      setXMLText: (data: string) => set({ xml: data }),
      setFormattedXML: (data: string) => set({ formattedXml: data }),
      getXMLText: () => get().xml,
      getFormattedXML: () => get().formattedXml,
    }),
    { name: "xml-formatter", enabled: true }
  )
);

export default useXMLFormatterStore;
