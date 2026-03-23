import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@monaco-editor/react";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { CopyIcon, Trash } from "lucide-react";
import { SyntheticEvent, useRef, useState } from "react";
import { toast } from "sonner";
import useJwtStore from "../stores/jwtStore";

const JWTDecoder = () => {
  const editorEncodedTokenRef = useRef<any>(null);
  const editorDecodedHeadersRef = useRef<any>(null);
  const editorDecodedPayloadRef = useRef<any>(null);
  const algorithms = ["HS256", "HS384", "HS512", "RS256", "ES256"];
  const modes = ["encode", "decode"];
  const [algorithm, setAlgorithm] = useState<string>("HS256");
  const [mode, setMode] = useState<string>("encode");
  // const [encodedToken, setEncodedToken] = useState<string>("");
  // const [decodedHeaders, setDecodedHeaders] = useState<any>(null);
  // const [decodedPayload, setDecodedPayload] = useState<any>(null);

  const {
    encodedToken,
    decodedHeaders,
    decodedPayload,
    setEncodedToken,
    setDecodedHeaders,
    setDecodedPayload,
    getDecodedHeaders,
    getDecodedPayload,
  }: any = useJwtStore();

  const editorEncodedTokenOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  const editorDecodedOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    readOnly: true,
  };

  function handleTextEncoded(editor: any) {
    editorEncodedTokenRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setEncodedToken(value);
    });
  }

  function handleDecode() {
    try {
      const decoded = decodeJwt(encodedToken);
      const headers = decodeProtectedHeader(encodedToken);
      setDecodedHeaders(headers);
      setDecodedPayload(decoded);
      editorDecodedHeadersRef.current?.setValue(
        JSON.stringify(headers, null, 2),
      );
      editorDecodedPayloadRef.current?.setValue(
        JSON.stringify(decoded, null, 2),
      );
    } catch (error: any) {
      toast.error(error.message, { position: "top-center" });
    }
  }

  function handleJwtHeader(editor: any) {
    editorDecodedHeadersRef.current = editor;
  }

  function handleJwtPayload(editor: any) {
    editorDecodedPayloadRef.current = editor;
  }

  function onClearEncodedToken() {
    editorEncodedTokenRef.current?.setValue("");
    editorDecodedHeadersRef.current?.setValue("");
    editorDecodedPayloadRef.current?.setValue("");
    setEncodedToken("");
    setDecodedHeaders({});
    setDecodedPayload({});
  }

  async function onCopyText() {
    try {
      await navigator.clipboard.writeText(encodedToken);
      toast.success("Copied to clipboard", { position: "top-center" });
    } catch (error: any) {
      toast.error(error.message, { position: "top-center" });
    }
  }

  return (
    <main className="p-2 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        JWT Decoder
      </p>
      <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[calc(100vh-5rem)]">
        <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
          <div className="flex flex-row items-center mb-2 justify-between">
            <span>Encoded Token</span>
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black"
              onClick={onClearEncodedToken}
            >
              <Trash />
            </Button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              options={editorEncodedTokenOptions}
              onMount={handleTextEncoded}
              defaultValue={encodedToken}
              defaultLanguage="plaintext"
            />
          </div>
        </div>

        <div className="flex items-center justify-center px-2 py-2 lg:py-0">
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
            onClick={handleDecode}
          >
            Decode
          </Button>
        </div>

        <div className="w-full lg:flex-1 flex flex-col min-h-[500px] lg:min-h-0">
          <div className="flex flex-row items-center mb-2 justify-between">
            <span>Decoded Header</span>
            {/* <div className="flex flex-row gap-2 items-center">
              <span>Algorithm</span>
              <Select onValueChange={setAlgorithm} value={algorithm}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select an algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {algorithms.map((algorithm) => (
                      <SelectItem key={algorithm} value={algorithm}>
                        {algorithm}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div> */}
            <div className="flex flex-row gap-2 items-center">
              <span>Mode</span>
              <Select onValueChange={setMode} value={mode}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select an algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {modes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="h-[25%] min-h-[120px]">
            <Editor
              height="100%"
              theme="vs-dark"
              options={editorDecodedOptions}
              defaultValue={JSON.stringify(decodedHeaders, null, 2)}
              defaultLanguage="json"
              onMount={handleJwtHeader}
            />
          </div>

          <div className="flex flex-row items-center my-2 justify-between">
            <span>Decoded Payload</span>
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black"
              onClick={onCopyText}
            >
              <CopyIcon />
            </Button>
          </div>
          <div className="flex-1 min-h-[200px]">
            <Editor
              height="100%"
              theme="vs-dark"
              options={editorDecodedOptions}
              defaultValue={JSON.stringify(decodedPayload, null, 2)}
              defaultLanguage="json"
              onMount={handleJwtPayload}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default JWTDecoder;
