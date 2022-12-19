import React from "react";
import Operator from '../Operator/Operator';

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
          <Operator isJsonPretty={true}/>
        </div>
      </div>
    </div>
  );
};

export default Home;
