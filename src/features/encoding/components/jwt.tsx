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
  };

  const handleSelectAlgorithm = ($event: SyntheticEvent<EventTarget>) => {
    const value = ($event.target as HTMLSelectElement).value;
    // setAlgorithm(value);
    console.log("value --->", value);
    // setAlgorithm((value as HTMLSelectElement).value as string);
    // console.log((value as HTMLSelectElement).value);
  };

  return (
    <main className="p-2 gap-2 w-full">
      <p className="text-xl font-extrabold text-default-800">JWT Decoder</p>
      <div className="grid grid-cols-9 items-center">
        <div className="w-full col-span-4 p-2">
          <div className="mt-2">
            <div className="flex flex-col justify-between gap-2 w-full">
              <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                <span>Encoded Token</span>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="hover:bg-gray-200 hover:text-black"
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
              <div>
                <Editor
                  height="88vh"
                  theme="vs-dark"
                  options={editorEncodedTokenOptions}
                  defaultLanguage="json"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex col-span-1 p-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
          >
            Decode
          </Button>
        </div>
        <div className="w-full col-span-4 p-2">
          <div className="mt-2">
            <div className="flex flex-col justify-between gap-2 w-full">
              <div className="flex flex-col justify-between gap-2 w-full">
                <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                  <span>Decoded Header</span>
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <span>Algorithm</span>
                    <Select onValueChange={setAlgorithm} value={algorithm}>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select an algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Algorithms</SelectLabel>
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
                <div>
                  <Editor
                    height="10vh"
                    theme="vs-dark"
                    options={editorDecodedOptions}
                    defaultLanguage="json"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between gap-2 w-full">
                <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                  <span>Secret</span>
                </div>
                <div>
                  <Editor
                    height="10vh"
                    theme="vs-dark"
                    options={editorDecodedOptions}
                    defaultLanguage="json"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between gap-2 w-full">
                <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                  <span>Decoded Payload</span>
                </div>
                <div>
                  <Editor
                    height="57vh"
                    theme="vs-dark"
                    options={editorDecodedOptions}
                    defaultLanguage="json"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JWTDecoder;
