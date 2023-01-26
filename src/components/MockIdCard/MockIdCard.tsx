import React from "react";
import ThaiIdCardTemplate from "../../assets/images/blank_id_card.png";
import "./MockIdCard.css";
type Props = {};

const MockIdCard = (props: Props) => {
  return (
    <div className="p-10 place-items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-12 h-screen">
        <div className="col-span-12">
          <div className="grid place-items-center">
            <nav className="p-3">
              <div className="container flex flex-wrap items-center justify-between mx-auto">
                <div className="flex md:order-2">
                  <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                    <div className="container">
                      <img
                        src={ThaiIdCardTemplate}
                        alt="Snow"
                        style={{ width: "100%" }}
                      />
                      <div className="bottom-left id-card-font numbers">1234567</div>
                      <div className="top-left id-card-font numbers">1 1008 00832 15 6</div>
                      <div className="top-left-name id-card-font numbers">นาย สมทวย คงควรคอย</div>
                      <div className="top-right">Top Right</div>
                      <div className="bottom-right">Bottom Right</div>
                      <div className="centered">Centered</div>
                    </div>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockIdCard;
