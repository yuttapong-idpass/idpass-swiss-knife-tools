import React from "react";
import JsonPretty from "../JsonPretty/JsonPretty";
import InputValue from "../InputValue/InputValue";
import OutputValue from "../OutputValue/OutputValue";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="w-full">
      <div className="flex flex-row">
        <div className="basis-1/6 border-4">
          <div className="flex flex-col">
            <div className="h-screen">
              <div>01</div>
              <div>01</div>
              <div>01</div>
              <div>01</div>
              <div>01</div>
              <div>01</div>
              <div>01</div>
              <div>01</div>
            </div>
          </div>
        </div>
        <div className="basis-full border-4">
          <div className="flex flex-col">
            <div className="h-screen">
              {/* <div className="h-3/6 border-4">02</div>
              <div className="h-3/6 border-4">02</div> */}
              <InputValue />
              <OutputValue />
            </div>
          </div>

        

        </div>
      </div>
    </div>
  );
};

export default Home;
