import { decodeJwt, decodeProtectedHeader, SignJWT } from "jose";
import { SyntheticEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, CopyIcon, ArrowLeftRight } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { toast } from "sonner";
import useJwtStore from "../stores/jwtStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JWTDecoder = () => {
  const editorEncodedTokenRef = useRef<any>(null);
  const editorDecodedHeadersRef = useRef<any>(null);
  const editorDecodedPayloadRef = useRef<any>(null);

  const algorithms = [
    { name: "HS256", alg: "HS256", typ: "JWT", algorithm: "HMACSHA256" },
    { name: "HS384", alg: "HS384", typ: "JWT", algorithm: "HMACSHA384" },
    { name: "HS512", alg: "HS512", typ: "JWT", algorithm: "HMACSHA512" },
  ];
  const modes = ["encode", "decode"];
  const [algorithmName, setAlgorithmName] = useState<string>("HS256");
  const [mode, setMode] = useState<string>("decode");

  const {
    encodedText,
    decodedHeaders,
    decodedText,
    secretKey,
    algorithm,
    setEncodedText,
    setDecodedHeaders,
    setDecodedText,
    setSecretKey,
    setAlgorithm,
  }: any = useJwtStore();

  const editorEdit = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  const editorReadOnly = {
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
      setEncodedText(value);
    });
  }

  function handleDecode() {
    try {
      const decoded = decodeJwt(encodedText);
      const headers = decodeProtectedHeader(encodedText);
      setDecodedHeaders(headers);
      setDecodedText(decoded);
      editorDecodedHeadersRef.current?.setValue(
        JSON.stringify(headers, null, 2),
      );
      editorDecodedPayloadRef.current?.setValue(
        JSON.stringify(decoded, null, 2),
      );
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        closeButton: true,
        duration: 3000,
      });
    }
  }

  async function handleEncode() {
    try {
      const secret = new TextEncoder().encode("1234556");

      const jwt = await new SignJWT(decodedText)
        .setProtectedHeader({ alg: algorithmName, typ: "JWT" })
        .sign(secret);

      console.log(jwt);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        closeButton: true,
        duration: 3000,
      });
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
    setEncodedText("");
    setDecodedHeaders({});
    setDecodedText({});
  }

  async function onCopyPayload() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(decodedText, null, 2));
      toast.success("Copied to clipboard", {
        position: "top-center",
        closeButton: true,
        duration: 3000,
      });
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        closeButton: true,
        duration: 3000,
      });
    }
  }

  async function onCopyHeader() {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(decodedHeaders, null, 2),
      );
      toast.success("Copied to clipboard", {
        position: "top-center",
        closeButton: true,
        duration: 3000,
      });
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        closeButton: true,
        duration: 3000,
      });
    }
  }

  return (
    <main className="p-2 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        JWT Decoder
      </p>

      <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[calc(100vh-5rem)]">
        {mode === "decode" ? (
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
                options={editorEdit}
                onMount={handleTextEncoded}
                defaultValue={encodedText}
                defaultLanguage="plaintext"
              />
            </div>
          </div>
        ) : (
          <div className="w-full lg:flex-1 flex flex-col min-h-[500px] lg:min-h-0">
            <div className="flex flex-col h-full">
              <div className="flex flex-row items-center mb-2 justify-between">
                <span>Decoded Header</span>
                <div className="flex flex-row gap-2 items-center">
                  <span>Algorithm</span>
                  <Select
                    defaultValue="HS256"
                    value={algorithmName}
                    onValueChange={(value) => setAlgorithmName(value)}
                  >
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {algorithms.map((item, index) => (
                          <SelectItem key={index} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="h-[140px] shrink-0">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  options={editorEdit}
                  defaultValue={JSON.stringify(decodedHeaders, null, 2)}
                  defaultLanguage="json"
                  onMount={handleJwtHeader}
                />
              </div>

              <div className="flex flex-row items-center my-2 justify-between">
                <span>Secret key</span>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black"
                  onClick={onCopyPayload}
                >
                  <CopyIcon />
                </Button>
              </div>
              <div className="h-[140px] shrink-0">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  options={editorEdit}
                  defaultValue={JSON.stringify(decodedText, null, 2)}
                  defaultLanguage="json"
                  onMount={handleJwtPayload}
                />
              </div>

              <div className="flex flex-row items-center my-2 justify-between">
                <span>Payload</span>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black"
                  onClick={onCopyPayload}
                >
                  <CopyIcon />
                </Button>
              </div>
              <div className="flex-1 min-h-[200px]">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  options={editorEdit}
                  defaultValue={JSON.stringify(decodedText, null, 2)}
                  defaultLanguage="json"
                  onMount={handleJwtPayload}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-row lg:flex-col items-center justify-center px-2 py-2 lg:py-0 gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {mode === "decode" ? "Encoded → Decoded" : "Decoded → Encoded"}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shrink-0"
            onClick={() => setMode(mode === "decode" ? "encode" : "decode")}
            title="Toggle mode"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
            onClick={mode === "decode" ? handleDecode : handleEncode}
          >
            {mode === "decode" ? "Decode" : "Encode"}
          </Button>
        </div>

        {mode === "decode" ? (
          <div className="w-full lg:flex-1 flex flex-col min-h-[500px] lg:min-h-0">
            <div className="flex flex-col h-full">
              <div className="flex flex-row items-center mb-2 justify-between">
                <span>Decoded Header</span>
                <div className="flex flex-row gap-2 items-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="hover:bg-gray-200 hover:text-black"
                    onClick={onCopyHeader}
                  >
                    <CopyIcon />
                  </Button>
                </div>
              </div>
              <div className="h-[180px] min-h-[120px] shrink-0">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  options={editorReadOnly}
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
                  onClick={onCopyPayload}
                >
                  <CopyIcon />
                </Button>
              </div>
              <div className="flex-1 min-h-[200px]">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  options={editorReadOnly}
                  defaultValue={JSON.stringify(decodedText, null, 2)}
                  defaultLanguage="json"
                  onMount={handleJwtPayload}
                />
              </div>
            </div>
          </div>
        ) : (
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
                options={editorReadOnly}
                onMount={handleTextEncoded}
                defaultValue={encodedText}
                defaultLanguage="plaintext"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default JWTDecoder;
