import JsBarcode from "jsbarcode";
import React, { SyntheticEvent, useEffect, useState } from "react";

type Props = {};

const BarCodeGenerator = (props: Props) => {
  const barcodeTypes = [
    { name: "code128", value: "code128", example: "Hi" },
    { name: "ean13", value: "ean13", example: "1234567890128" },
    { name: "ean8", value: "ean8", example: "12345670" },
    { name: "ean5", value: "ean5", example: "12345" },
    { name: "ean2", value: "ean2", example: "12" },
    { name: "upc-a", value: "upc", example: "123456789012" },
    { name: "code39", value: "code39", example: "Hello" },
    { name: "itf14", value: "itf14", example: "1234567890123" },
    { name: "msi", value: "msi", example: "123456" },
    { name: "pharmacode", value: "pharmacode", example: "12345" },
  ];

  const [barcodeType, setBarCodeType] = useState(barcodeTypes[0].value);
  const [example, setExample] = useState("ABC-1234");
  const [barcodeInput, setBarCodeInput] = useState("ABC-1234");

  const handleSelectBarCodeType = (event$: SyntheticEvent<EventTarget>) => {
    const type = (event$.target as HTMLInputElement).value;
    const indexExample: number = barcodeTypes.findIndex(
      (item) => item.value === type
    );

    const getValueExample = barcodeTypes[indexExample].example;

    setExample(getValueExample);
    setBarCodeInput(getValueExample);
    setBarCodeType(type);
  };

  const handleBarCodeInput = (event$: SyntheticEvent<EventTarget>) => {
    const value = (event$.target as HTMLInputElement).value;
    setBarCodeInput(value);
  };

  const onClickGenerateBarCode = () => {
    renderBarCode();
  };

  const renderBarCode = () => {
    JsBarcode("#barcode", barcodeInput, {
      fontSize: 20,
      background: "#ffffff",
      lineColor: "#000000",
      format: barcodeType,
    });
  };

  useEffect(() => {
    renderBarCode();
  }, [example]);

  return (
    <div className="w-full bg-primary p-4 flex flex-col gap-2">
      <div className="row-end-1">
        <label htmlFor="BarCode" className="text-lg font-medium text-primary">
          Barcode Generator
        </label>
      </div>
      <div className="flex flex-col rounded-md row-end-1 justify-items-center w-full bg-secondary p-4">
        <div className="flex flex-col gap-6 place-items-center">
          <div className="flex flex-row gap-2 w-full justify-center m-auto items-center">
            <div>
              <label
                htmlFor="type"
                className="text-lg mr-2 font-medium text-primary"
              >
                Type:
              </label>
              <select
                name="type"
                id="type"
                className="rounded-md text-primary bg-primary p-2"
                onChange={handleSelectBarCodeType}
              >
                {barcodeTypes.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                value={barcodeInput}
                className="rounded-md text-primary bg-primary p-2 shadow-lg"
                onChange={handleBarCodeInput}
              />
            </div>
            <div>
              <button
                title="Generate"
                className="
                      inline-flex 
                      w-full 
                      item-centers 
                      justify-center 
                      px-4 
                      py-2 
                      text-base 
                      font-medium 
                      leading-6 
                    text-[#ffffff] 
                      dark:text-dark-300
                      whitespace-no-wrap 
                      bg-success 
                      rounded-md 
                      shadow-sm
                    bg-lime-500
                    hover:bg-lime-400
                    dark:bg-lime-300
                    dark:hover:bg-lime-500"
                onClick={onClickGenerateBarCode}
              >
                Generate
              </button>
            </div>
            <div>
              <button
                title="Refresh"
                className="
                      inline-flex 
                      w-full 
                      item-centers 
                      justify-center 
                      px-4 
                      py-2 
                      text-base 
                      font-medium 
                      leading-6 
                    text-[#ffffff] 
                      dark:text-dark-300
                      whitespace-no-wrap 
                      bg-success 
                      rounded-md 
                      shadow-sm
                    bg-blue-500
                    hover:bg-blue-400
                    dark:bg-blue-300
                    dark:hover:bg-blue-500"
              >
                Refresh
              </button>
            </div>
          </div>
          <div>
            <span className="text-primary text-lg">
              Example Format: {example}{" "}
            </span>
          </div>
          <div className="flex flex-cols">
            <div>
              <svg id="barcode" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarCodeGenerator;
