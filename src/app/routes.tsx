import { Route, Routes } from "react-router-dom";
import TextCompare from "@/features/formatter/components/TextCompare/TextCompare";
import JsonFormatter from "@/features/formatter/components/JsonFormatter/JsonFormatter";
import ResultCompare from "@/features/formatter/components/TextCompare/ResultCompare";
import Differ from "@/features/formatter/components/TextCompare/Differ";
import XMLToJSON from "@/features/formatter/components/XmlTojson/XmlTojson";
import XMLFormatter from "@/features/formatter/components/XmlFormatter/XmlFormatter";
import KibanaLogExtractor from "@/features/utilities/components/KibanaLogExtractor";
import MockUpIdCard from "@/features/utilities/components/MockUpIdCard";
import JWTDecoder from "@/features/encoding/components/jwt";
import Base64ToImage from "@/features/formatter/components/Base64ToImage/ฺBase64ToImage";
import UrlEncoderDecoder from "@/features/encoding/components/urlEncoderDecoder";
import Base64EncoderDecoder from "@/features/encoding/components/base64EncoderDecoder";
import BarCodeGenerator from "@/features/utilities/components/BarCodeGenerator";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<JsonFormatter />} />
      <Route path="/json-formatter" element={<JsonFormatter />} />
      <Route path="/text-compare" element={<TextCompare />}>
        <Route index element={<Differ />} />
        <Route path="differ" element={<Differ />} />
        <Route path="result-compare" element={<ResultCompare />} />
      </Route>
      <Route path="/xml-to-json" element={<XMLToJSON />} />
      <Route path="/xml-formatter" element={<XMLFormatter />} />
      <Route path="/jwt-decoder" element={<JWTDecoder />} />
      <Route path="/encoded-decoded-url" element={<UrlEncoderDecoder />} />
      <Route path="/kibana-log-extractor" element={<KibanaLogExtractor />} />
      <Route path="/mock-up-id-card" element={<MockUpIdCard />} />
      <Route path="/base64ToImage" element={<Base64ToImage />} />
      <Route
        path="/base64-encoder-decoder"
        element={<Base64EncoderDecoder />}
      />
      <Route path="/barcode-generator" element={<BarCodeGenerator />} />
    </Routes>
  );
}
