import React, { useState } from "react";
import FloppyDiskImage from "../../assets/images/floppy-disk.png";
import FullScreenImage from "../../assets/images/full-screen.png";
import ExitFullScreenImage from "../../assets/images/exit-fullscreen.png";
import CopyToClipboardImage from "../../assets/images/copy-to-clipboard.png";
import Upload from "../../assets/images/photo.png";
import "./FromBase64.css";
import { useSelector } from "react-redux";
import { base64Selector, base64 } from "../../store/slice/Base64Slice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppDispatch } from "../../store/store";

type Props = {};

interface IDescriptionImg {
  width: number;
  height: number;
}

const FromBase64 = (props: Props) => {
  const base64Reducer = useSelector(base64Selector);
  const dispatch = useAppDispatch();

  const options = [
    { value: "base64", text: "to base64" },
    { value: "image", text: "to image" },
  ];

  let descriptionImg: IDescriptionImg = {
    width: 0,
    height: 0,
  };

  const [inputToggleFullScreen, setInputToggleFullScreen] = useState(false);
  const [outputToggleFullScreen, setOutputToggleFullScreen] = useState(false);
  const [descriptionImage, setDescriptionImage] = useState(descriptionImg);
  const [selected, setSelected] = useState(options[0].value);
  const [imageToBase64, setImageToBase64] = useState("");
  const [base64ToImage, setBase64ToImage] = useState("");

  const handleSelectOption = ($event: any) => {
    dispatch(base64({ base64: "" }));
    setImageToBase64("");
    setBase64ToImage("");
    setSelected($event.target.value);
  };

  const handleBase64 = () => {
    if (!!base64ToImage) {
      // let base64String = data.result.replace("data:", "").replace(/^.+,/, "");
      // dispatch(base64({ base64: 'data:image/jpeg;base64,' + base64String}))
      let base64String: string = base64ToImage
        .replace("data:", "")
        .replace(/^.+,/, "");
      const convertToPng: string = "data:image/png;base64," + base64String;
      imageBase64(convertToPng);
      dispatch(base64({ base64: convertToPng }));
    } else {
      setImageToBase64(base64Reducer.base64);
    }
  };

  const handleChange = (event$: any) => {
    console.log(event$.target.value);
  };

  const handleChangeBase64 = (event$: any) => {
    setBase64ToImage(event$.target.value);
  };

  const imageUpload = (event$: any) => {
    const fileUploaded = event$.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      // let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
      // dispatch(base64({ base64: base64String }))
      let images = new Image();
      images.src = reader.result;
      images.onload = () => {
        let height = images.height;
        let width = images.width;
        const description: IDescriptionImg = {
          height: height,
          width: width,
        };
        setDescriptionImage(description);
      };
      const base64String = reader.result;
      dispatch(base64({ base64: base64String }));
    };
    reader.readAsDataURL(fileUploaded);
  };

  const imageBase64 = (image: string) => {
    let images = new Image();
    images.onload = function () {
      let height = images.height;
      let width = images.width;
      const description: IDescriptionImg = {
        height: height,
        width: width,
      };
      setDescriptionImage(description);
    };
    images.src = image;
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="h-screen">
          <div className="border" style={{ height: "47%" }}>
            <div
              className={`flex flex-col h-full ${
                inputToggleFullScreen ? "myModal" : ""
              }`}
            >
              <div className="border">
                <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
                  <div className="flex items-center flex-shrink-0 text-white mr-6">
                    {/* <img
                      src={FloppyDiskImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      width={"50%"}
                      height={"50%"}
                    /> */}
                    <img
                      src={
                        inputToggleFullScreen
                          ? ExitFullScreenImage
                          : FullScreenImage
                      }
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      onClick={() => {
                        setInputToggleFullScreen(!inputToggleFullScreen);
                      }}
                    />

                    {selected === "base64" ? (
                      <div className="image-upload">
                        <label htmlFor="file-input">
                          <img
                            src={Upload}
                            className="fill-current h-8 w-8 mr-2 p-1 cursor"
                          />
                        </label>
                        <input
                          id="file-input"
                          type="file"
                          accept="image/png, image/gif, image/jpeg"
                          onChange={imageUpload}
                        />
                      </div>
                    ) : null}
                    <select
                      className="inline-block text-sm px-3 py-1 leading-none border rounded text-black border-white  hover:bg-white mt-4 lg:mt-0"
                      value={selected}
                      onChange={handleSelectOption}
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </nav>
              </div>
              <div
                className={`border grow ${
                  selected === "base64" ? "display-area" : ""
                }`}
              >
                {/* <textarea
                  id="inputText"
                  className="w-full h-full resize-none p-2"
                  placeholder="Input here ..."
                ></textarea> */}
                {selected === "base64" ? (
                  <div className="flex flex-col items-center p-5">
                    {!!base64Reducer.base64 ? (
                      <div>
                        <figure className="max-w-lg">
                          <figcaption className="mt-2 text-sm text-center text-black-500 dark:text-black-400">
                            <p className="text-gray-700 text-base mb-4">
                              height x width: {descriptionImage.height} x{" "}
                              {descriptionImage.width}{" "}
                            </p>
                          </figcaption>
                          <img
                            className="h-auto max-w-full"
                            src={base64Reducer.base64}
                            alt="image description"
                          />
                        </figure>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <textarea
                    id="inputText"
                    className="w-full h-full resize-none p-2"
                    placeholder="Input base 64 here ...."
                    onChange={handleChangeBase64}
                  ></textarea>
                )}
              </div>
            </div>
          </div>
          <div className="border" style={{ height: "6%" }}>
            <div className="flex flex-col items-center">
              <button
                className="
              justify-self-end 
              bg-blue-500 
              hover:bg-blue-400 
              text-white 
              font-bold
              mt-1 
              py-1 
              px-4 
              border-b-4 
              border-blue-700 
              hover:border-blue-500 
              rounded"
                onClick={handleBase64}
              >
                RESULT
              </button>
            </div>
          </div>
          <div className="border" style={{ height: "47%" }}>
            <div
              className={`flex flex-col h-full ${
                outputToggleFullScreen ? "myModal" : ""
              }`}
            >
              <div className="border">
                <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
                  <div className="flex items-center flex-shrink-0 text-white mr-6">
                    {/* <img
                      src={FloppyDiskImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                    /> */}
                    <img
                      src={
                        outputToggleFullScreen
                          ? ExitFullScreenImage
                          : FullScreenImage
                      }
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      onClick={() => {
                        setOutputToggleFullScreen(!outputToggleFullScreen);
                      }}
                    />

                    {selected === "base64" ? (
                      <CopyToClipboard
                        text={base64Reducer.base64}
                        onCopy={() => {}}
                      >
                        <img
                          src={CopyToClipboardImage}
                          className="fill-current h-8 w-8 mr-2 p-1 cursor"
                        />
                      </CopyToClipboard>
                    ) : null}
                  </div>
                </nav>
              </div>
              <div
                className={`border grow ${
                  selected === "image" ? "display-area" : ""
                }`}
              >
                <div className="h-full">
                  {selected === "base64" ? (
                    <textarea
                      className="w-full h-full resize-none p-4"
                      value={imageToBase64 || ""}
                      onChange={handleChange}
                      placeholder="Output here ..."
                    ></textarea>
                  ) : (
                    <div className="flex flex-col items-center">
                      {!!base64Reducer.base64 ? (
                        <div>
                          <figure className="max-w-lg">
                            <figcaption className="mt-2 text-sm text-center text-black-500 dark:text-black-400">
                              <p className="text-gray-700 text-base mb-4">
                                height x width: {descriptionImage.height} x{" "}
                                {descriptionImage.width}{" "}
                              </p>
                            </figcaption>
                            <img
                              className="h-auto max-w-full"
                              src={base64Reducer.base64}
                              alt="image description"
                            />
                          </figure>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FromBase64;
