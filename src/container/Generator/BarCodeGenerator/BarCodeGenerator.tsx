import JsBarcode from "jsbarcode";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {};

interface IForm {
  barcodeType: string;
  barcodeInput: string;
  exampleFormat: string;
}

const BarCodeGenerator = (props: Props) => {
  const barcodeTypes = [
    { name: "code128", value: "code128", example: "ABC-1234" },
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

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      barcodeInput: "ABC-1234",
      barcodeType: "code128",
      exampleFormat: "ABC-1234",
    },
  });

  const examples = watch("exampleFormat");

  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSelectBarCodeType = (event$: SyntheticEvent<EventTarget>) => {
    const type = (event$.target as HTMLInputElement).value;
    const indexExample: number = barcodeTypes.findIndex(
      (item) => item.value === type
    );

    const getValueExample = barcodeTypes[indexExample].example;
    setValue("barcodeInput", getValueExample);
    setValue("barcodeType", type);
    setValue("exampleFormat", getValueExample);
  };

  const onSubmit: SubmitHandler<IForm> = (data) => {
    renderBarCode();
  };

  const errorStatus = (status: boolean, description: string = "") => {
    if (status) {
      setIsError(true);
      setErrorMessage(description);
    } else {
      setIsError(false);
      setErrorMessage("");
    }
  };

  const renderBarCode = () => {
    errorStatus(false);
    try {
      JsBarcode("#barcode", getValues("barcodeInput"), {
        fontSize: 20,
        background: "#ffffff",
        lineColor: "#000000",
        format: getValues("barcodeType"),
      });
    } catch (error: any) {
      errorStatus(true, error);
    }
  };

  useEffect(() => {
    renderBarCode();
  }, [examples]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-primary p-4 flex flex-col gap-2"
    >
      <div>
        <div className="row-end-1">
          <label htmlFor="BarCode" className="text-lg font-medium text-primary">
            Barcode Generator
          </label>
        </div>
        <div className="flex flex-col rounded-md row-end-1 justify-items-center w-full bg-secondary p-4">
          <div className="flex flex-col gap-6 place-items-center">
            <div className="flex flex-row gap-2 w-full justify-center">
              <div>
                <span className="text-primary p-2 text-lg font-medium">
                  Type:
                </span>
              </div>
              <div>
                <select
                  id="selectBarcodeType"
                  className="rounded-md relative text-primary bg-primary p-2 shadow-lg"
                  {...register("barcodeType", {
                    required: true,
                    onChange: (e) => {
                      handleSelectBarCodeType(e);
                    },
                  })}
                >
                  {barcodeTypes.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </select>
                {errors.barcodeType?.type === "required" && (
                  <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    Invalid username field !
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Input barcode..."
                    className="rounded-md relative text-primary bg-primary p-2 shadow-lg"
                    {...register("barcodeInput", {
                      required: true,
                    })}
                  />
                </div>
                {errors.barcodeInput?.type === "required" && (
                  <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    Please input barcode text !
                  </span>
                )}
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
            <div className="flex flex-col">
              <div>
                <svg id="barcode" />
              </div>
            </div>
            <div>
              {isError && (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  {errorMessage} 
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BarCodeGenerator;
