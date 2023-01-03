import React, { useState } from "react";
import FloppyDiskImage from "../../assets/images/floppy-disk.png";
import FullScreenImage from "../../assets/images/full-screen.png";
import ExitFullScreenImage from "../../assets/images/exit-fullscreen.png";
import CopyToClipboardImage from "../../assets/images/copy-to-clipboard.png";
import Upload from "../../assets/images/photo.png";
import "./FromBase64.css";
import { useSelector } from "react-redux";
import { base64Selector, base64 } from "../../store/slice/Base64Slice";
import { useAppDispatch } from "../../store/store";

type Props = {};

const FromBase64 = (props: Props) => {
  const base64Reducer = useSelector(base64Selector);
  const dispatch = useAppDispatch();

  const options = [
    { value: "string", text: "to string" },
    { value: "image", text: "to image" },
  ];

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
            <div className={`flex flex-col h-full`}>
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
                      src={FullScreenImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      onClick={() => {}}
                    />
                    {selected === "string" ? (
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
              <div className="border grow">
                {/* <textarea
                  id="inputText"
                  className="w-full h-full resize-none p-2"
                  placeholder="Input here ..."
                ></textarea> */}

                {selected === "string" ? (
                  <div className="flex flex-col items-center">
                    {/* */}
                    {!!base64Reducer.base64 ? (
                      <img
                        src={base64Reducer.base64}
                        className="p-4 object-scale-down w-72 h-72"
                      />
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
            <div className={`flex flex-col h-full`}>
              <div className="border">
                <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
                  <div className="flex items-center flex-shrink-0 text-white mr-6">
                    {/* <img
                      src={FloppyDiskImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                    /> */}
                    <img
                      src={FullScreenImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      onClick={() => {}}
                    />
                  </div>
                </nav>
              </div>
              <div className="border grow">
                <div className="h-full">
                  {selected === "string" ? (
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
