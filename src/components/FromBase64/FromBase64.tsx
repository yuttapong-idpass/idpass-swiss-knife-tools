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
  name: string;
  width: number;
  height: number;
  size: number;
}

const FromBase64 = (props: Props) => {
  const base64Reducer = useSelector(base64Selector);
  const dispatch = useAppDispatch();

  const options = [
    { value: "base64", text: "to base64" },
    { value: "image", text: "to image" },
  ];

  let descriptionImg: IDescriptionImg = {
    name: "",
    width: 0,
    height: 0,
    size: 0,
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
      let base64String = base64ToImage.replace("data:", "").replace(/^.+,/, "");
      dispatch(base64({ base64: "data:image/jpeg;base64," + base64String }));
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
        let sizes = Number((fileUploaded.size / 1024).toFixed(2));
        let name = fileUploaded.name;

        const description: IDescriptionImg = {
          height: height,
          width: width,
          size: sizes,
          name: name,
        };
        setDescriptionImage(description);
      };

      // console.log()

      const base64String = reader.result;
      dispatch(base64({ base64: base64String }));
    };
    reader.readAsDataURL(fileUploaded);
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
                    {/* {!!base64Reducer.base64 ? (
                      <div className="self-center">
                        <img
                          src={base64Reducer.base64}
                          className="p-4 object-scale-down w-auto h-48"
                        />
                        <span>name: {descriptionImage.name} </span>
                        <span>height: {descriptionImage.height} </span>
                        <span>width: {descriptionImage.width} </span>
                        <span>size: {descriptionImage.size} KB </span>
                      </div>
                    ) : null} */}

                    <div className="flex justify-center">
                      <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg">
                        <img
                          className=" w-full h-full md:h-auto object-cover md:w-72 rounded-t-lg md:rounded-none md:rounded-l-lg"
                          src={base64Reducer.base64}
                          alt=""
                        />
                        <div className="p-6 flex flex-col justify-start">
                          <h5 className="text-gray-900 text-xl font-medium mb-2">
                            Details
                          </h5>
                          <p className="text-gray-700 text-base mb-4">
                            This is a wider card with supporting text below as a
                            natural lead-in to additional content. This content
                            is a little bit longer.
                          </p>
                          <p className="text-gray-600 text-xs">
                            Last updated 3 mins ago
                          </p>
                        </div>
                      </div>
                    </div>
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
              <div className="border grow">
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
                        <img
                          src={base64Reducer.base64}
                          className="p-4 object-scale-down w-72 h-72"
                        />
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
