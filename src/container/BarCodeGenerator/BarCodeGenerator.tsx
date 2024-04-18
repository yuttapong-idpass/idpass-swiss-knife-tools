import JsBarcode from "jsbarcode";
import React, { SyntheticEvent, useEffect, useState } from "react";

type Props = {};

const BarCodeGenerator = (props: Props) => {
  const barcodeTypes = [
    { name: "code128", value: "code128" },
    { name: "ean13", value: "ean13" },
    { name: "ean8", value: "ean8" },
    { name: "ean5", value: "ean5" },
    { name: "ean2", value: "ean2" },
    { name: "upc", value: "upc" },
    { name: "code39", value: "code39" },
    { name: "itf14", value: "itf14" },
    { name: "msi", value: "msi" },
    { name: "pharmacode", value: "pharmacode" },
  ];

  const [barcodeType, setBarCodeType] = useState(barcodeTypes[0].value);
  const [barcodeInput, setBarCodeInput] = useState("");

  const handleSelectBarCodeType = (event$: SyntheticEvent<EventTarget>) => { 
    const type = (event$.target as HTMLInputElement).value;
    setBarCodeType(type);
  }

  const handleBarCodeInput = (event$: SyntheticEvent<EventTarget>) => { 

  }

  useEffect(() => {
    JsBarcode("#barcode", "HI!", {
      fontSize: 40,
      background: "#ffffff",
      lineColor: "#000000",
      text: "HI!",
      format: "",
    });
  }, []);

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
                className="rounded-md text-primary bg-primary p-2 shadow-lg"
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
