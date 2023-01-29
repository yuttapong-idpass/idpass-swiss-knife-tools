import React, { useEffect, useState } from "react";
import axios from "axios";
import ThaiIdCardTemplate from "../../assets/images/blank_id_card.png";
import "./MockIdCard.css";
import { useAppDispatch } from "../../store/store";
import {
  getAllProvince,
  getAllAmphure,
  provinceSelector,
  amphureSelector,
  getAllTumbol,
} from "../../store/slice/provinceSlice";
import sharedService from "../shared/share-api";
import { useSelector } from "react-redux";

type Props = {};

const MockIdCard = (props: Props) => {
  const provinceReducer: any = useSelector(provinceSelector);
  const amphureReducer: any = useSelector(amphureSelector);
  const dispatch = useAppDispatch();
  let defaultProvinces = [
    {
      id: 0,
      name_th: "กรุณาเลือกจังหวัด",
      name_en: "",
    },
  ];

  let defaultAmphure = [
    {
      id: 0,
      name_th: "กรุณาเลือกอำเภอ",
      name_en: "",
    },
  ];

  const [allProvince, setAllProvince] = useState(defaultProvinces);
  const [filterAmphure, setFilterAmphure] = useState(defaultAmphure);
  const [selectProvince, setSelectProvince] = useState({});
  const [selectAmphue, setSelectAmphur] = useState({});

  useEffect(() => {
    sharedService.getAllProvince().then((data: any) => {
      dispatch(getAllProvince({ province: data.data }));
      setAllProvince(data.data);
    });

    sharedService.getAllAmphure().then((data: any) => {
      dispatch(getAllAmphure({ amphure: data.data }));
    });

    sharedService.getAllTumbol().then((data: any) => { 
      dispatch(getAllTumbol({ tumbol: data.data }));
    })
  }, []);

  const handleSelectOption = ($event: any) => {
    const provinceId = $event.target.value;
    const filters = amphureReducer.amphure.amphure.filter(
      (item: any) => Number(item.province_id) === Number(provinceId)
    );

    // console.log('dd', allProvince[provinceId - 1])
    setSelectProvince(allProvince[provinceId - 1])
    setFilterAmphure(filters);
  };

  return (
    <div className="p-4 place-items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-12 h-screen ">
        <div className="col-span-12">
          <div>
            <div className="p-2">
              <div>
                <div
                  id="message"
                  className="
                    block 
                    p-4
                    w-full 
                    text-sm 
                    text-gray-900 
                    bg-gray-50 
                    rounded-lg 
                    border 
                    border-gray-300 
                    border-dashed border-2 border-gray-300
                    "
                >
                  <div className="grid place-items-center">
                    <nav className="p-3">
                      <div className="container flex flex-wrap justify-between mx-auto">
                        <div className="flex md:order-2">
                          <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                ชื่อ :
                              </label>
                              <input
                                type="input"
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                นามสกุล :
                              </label>
                              <input
                                type="input"
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </nav>

                    <nav className="p-3">
                      <div className="container flex flex-wrap justify-between mx-auto">
                        <div className="flex md:order-2">
                          <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                บ้านเลขที่ :
                              </label>
                              <input
                                type="input"
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                ซอย :
                              </label>
                              <input
                                type="input"
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </nav>

                    <nav className="p-3">
                      <div className="container flex flex-wrap justify-between mx-auto">
                        <div className="flex md:order-2">
                          <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                หมู่ที่ :
                              </label>
                              <input
                                type="input"
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                ถนน :
                              </label>
                              <input
                                type="input"
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </nav>

                    <nav className="p-3">
                      <div className="container flex flex-wrap justify-between mx-auto">
                        <div className="flex md:order-2">
                          <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                หมู่บ้าน :
                              </label>
                              <input
                                type="input"
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                จังหวัด :
                              </label>
                              <select
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                                onChange={handleSelectOption}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  defaultValue={0}
                                  value={0}
                                >
                                  กรุณาเลือกจังหวัด
                                </option>
                                {allProvince.map((item: any) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name_th}
                                  </option>
                                ))}
                              </select>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </nav>

                    <nav className="p-3">
                      <div className="container flex flex-wrap justify-between mx-auto">
                        <div className="flex md:order-2">
                          <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                ห้อง :
                              </label>
                              <input
                                type="input"
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                เขต / อำเภอ :
                              </label>
                              <select
                                className="inline-block 
                                            text-sm 
                                            px-3 
                                            py-2 
                                            leading-none 
                                            border 
                                            rounded 
                                            text-black 
                                            border-gray-800
                                            hover:bg-white 
                                            mt-1
                                            w-40
                                            lg:mt-0"
                              >
                                {filterAmphure.map((item: any) => (
                                  <option key={item.id} value={item.name_th}>
                                    {item.name_th}
                                  </option>
                                ))}
                              </select>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>

              <div
                id="message"
                className="
                    mt-5
                    block 
                    p-4
                    w-full 
                    text-sm 
                    text-gray-900 
                    bg-gray-50 
                    rounded-lg 
                    border 
                    border-gray-300 
                    border-dashed border-2 border-gray-300
                    grid place-items-center h-full mt-5
                    "
              >
                <h1 className="text-xl font-bold text-gray-900">
                  หมายเลขบัตรประชาชน : ss
                </h1>
              </div>

              <div>
                <div className="grid place-items-center h-full mt-5">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      className="
                      text-white 
                      bg-neutral-400 
                      bg-green-500 
                      hover:bg-[#FF9119]/80 
                      focus:ring-4 
                      focus:outline-none 
                      focus:ring-[#FF9119]/50 
                      font-medium 
                      rounded-lg 
                      text-sm 
                      px-5 
                      py-2.5 
                      text-center 
                      inline-flex 
                      items-center 
                      dark:hover:bg-[#FF9119]/80 
                      dark:focus:ring-[#FF9119]/40 
                      mr-1 
                      mb-1"
                    >
                      ตรวจสอบ
                    </button>

                    <button
                      className="
                      text-white 
                      bg-neutral-400 
                      bg-blue-500 
                      hover:bg-[#FF9119]/80 
                      focus:ring-4 
                      focus:outline-none 
                      focus:ring-[#FF9119]/50 
                      font-medium 
                      rounded-lg 
                      text-sm 
                      px-5 
                      py-2.5 
                      text-center 
                      inline-flex 
                      items-center 
                      dark:hover:bg-[#FF9119]/80 
                      dark:focus:ring-[#FF9119]/40 
                      mr-1 
                      mb-1"
                    >
                      สุ่ม
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockIdCard;
