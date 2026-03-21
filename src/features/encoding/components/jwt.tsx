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
import { Trash } from "lucide-react";
import { SyntheticEvent, useState } from "react";

const JWTDecoder = () => {
  const algorithms = ["HS256", "HS384", "HS512", "RS256", "ES256"];
  const [algorithm, setAlgorithm] = useState<string>("HS256");
  const editorEncodedTokenOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
  };

  const editorDecodedOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    readOnly: true,
  };

  const handleSelectAlgorithm = ($event: SyntheticEvent<EventTarget>) => {
    const value = ($event.target as HTMLSelectElement).value;
    // setAlgorithm(value);
    console.log("value --->", value);
    // setAlgorithm((value as HTMLSelectElement).value as string);
    // console.log((value as HTMLSelectElement).value);
  };

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
            >
              <Trash />
            </Button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              options={editorEncodedTokenOptions}
              defaultLanguage="json"
            />
          </div>
        </div>

        <div className="flex items-center justify-center px-2 py-2 lg:py-0">
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
          >
            Decode
          </Button>
        </div>

        <div className="w-full lg:flex-1 flex flex-col min-h-[500px] lg:min-h-0">
          <div className="flex flex-row items-center mb-2 justify-between">
            <span>Decoded Header</span>
            <div className="flex flex-row gap-2 items-center">
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
            </div>
          </div>
          <div className="h-[25%] min-h-[120px]">
            <Editor
              height="100%"
              theme="vs-dark"
              options={editorDecodedOptions}
              defaultLanguage="json"
            />
          </div>

          <div className="flex flex-row items-center my-2 justify-between">
            <span>Decoded Payload</span>
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black"
            >
              <Trash />
            </Button>
          </div>
          <div className="flex-1 min-h-[200px]">
            <Editor
              height="100%"
              theme="vs-dark"
              options={editorDecodedOptions}
              defaultLanguage="json"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default JWTDecoder;
