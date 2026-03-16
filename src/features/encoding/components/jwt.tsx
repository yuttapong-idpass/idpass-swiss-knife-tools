import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { Trash } from "lucide-react";

const JWTDecoder = () => {
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
