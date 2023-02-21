import React, { useEffect, useState } from "react";
import axios from "axios";
import ThaiIdCardTemplate from "../../assets/images/blank_id_card.png";
import WomenPreviewImage from "../../assets/images/removebg-preview.png";
import WomenPreviewImage2 from "../../assets/images/remove-bg-mock.png";
import MenPreviewImage from "../../assets/images/men-removebg-preview.png";
import "./MockIdCard.css";
import { useAppDispatch } from "../../store/store";
import {
  getAllProvince,
  getAllAmphure,
  getAllTumbol,
  provinceSelector,
  amphureSelector,
  tumbolSelector,
} from "../../store/slice/provinceSlice";
import sharedService from "../shared/share-api";
import { useSelector } from "react-redux";

type Props = {};

const userDataObject = {
  titleName: "",
  firstName: "",
  lastName: "",
  enFirstName: "",
  enLastName: "",
  thaiBirthDate: "",
  idCard: "",
  nationalBirthDate: "",
  homeNo: "",
  soi: "",
  mooNo: "",
  road: "",
  mooBan: "",
};

const MockIdCard = (props: Props) => {
  const provinceReducer: any = useSelector(provinceSelector);
  const amphureReducer: any = useSelector(amphureSelector);
  const tumbolReducer: any = useSelector(tumbolSelector);
  const dispatch = useAppDispatch();


  const MONTH_TH_MINI = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const MONTH_MINI = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];



  const [yearIssue, setYearIssue] = useState([]);
  const [yearExpire, setYearExpire] = useState([]);
  const [fullYearIssue, setFullYearIssue] = useState('');
  const [fullYearExpire, setFullYearExpire] = useState('');
  const [days, setDays] = useState([]);
  const [allProvince, setAllProvince] = useState([]);
  const [filterAmphure, setFilterAmphure] = useState([]);
  const [filterTumbol, setFilterTumbol] = useState([]);
  const [selectProvince, setSelectProvince] = useState({});
  const [selectAmphue, setSelectAmphur] = useState({});
  const [values, setValues] = useState(userDataObject);

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
    });

    getYearIssue();
    getYearExpire();
    getDays();
  }, []);

  const getYearIssue = () => {
    let YEAR_ISSUE: any = [];
    let min = (new Date().getFullYear() - 9) + 543;
    let max = min + 10;
    for (let i = min; i <= max; i++) {
      YEAR_ISSUE.push(i);
    }
    setYearIssue(YEAR_ISSUE);
  };

  const getYearExpire = () => { 
    let YEAR_EXPIRE: any = [];
    let min = (new Date().getFullYear()) + 543;
    let max = min + 10;
    for (let i = min; i <= max; i++) { 
      YEAR_EXPIRE.push(i);
    }
    setYearExpire(YEAR_EXPIRE);
  }

  const getDays = () => { 
    let days: any = [];
    for (let i = 1; i <= 31; i++) { 
      days.push(i);
    }
    setDays(days);
  }

  const handleInputChange = ($event: any) => {
    const { name, value } = $event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSelectProvince = ($event: any) => {
    const provinceId = $event.target.value;
    const filterAmphure = amphureReducer.amphure.amphure.filter(
      (item: any) => Number(item.province_id) === Number(provinceId)
    );
    setSelectProvince(allProvince[provinceId - 1]);
    setFilterAmphure(filterAmphure);
    getDefaultAmphur(filterAmphure[0]);
  };

  const findTumbol = (amphurId: any) => {
    const findTumbols = tumbolReducer.tumbol.tumbol.filter(
      (item: any) => Number(item.amphure_id) === Number(amphurId)
    );
    setFilterTumbol(findTumbols);
  };

  const getDefaultAmphur = (getDefault: any) => {
    findTumbol(getDefault.id);
  };

  const handleSelectAmphur = ($event: any) => {
    const amphurId = $event.target.value;
    findTumbol(amphurId);
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
                                คำนำหน้า :
                              </label>
                              <input
                                type="input"
                                name="titleName"
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
                                onChange={handleInputChange}
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                ชื่อ :
                              </label>
                              <input
                                type="input"
                                name="firstName"
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
                                onChange={handleInputChange}
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
                                name="lastName"
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
                                onChange={handleInputChange}
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                เลขประจำตัวประชาชน :
                              </label>
                              <input
                                type="input"
                                name="idCard"
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
                                onChange={handleInputChange}
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
                                ชื่อ (อังกฤษ) :
                              </label>
                              <input
                                type="input"
                                name="enFirstName"
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
                                onChange={handleInputChange}
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                นามสกุล (อังกฤษ) :
                              </label>
                              <input
                                type="input"
                                name="enLastName"
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
                                onChange={handleInputChange}
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                วันเกิด (ไทย):
                              </label>
                              <input
                                type="input"
                                name="thaiBirthDate"
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
                                onChange={handleInputChange}
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                วันเกิด (สากล) :
                              </label>
                              <input
                                type="input"
                                name="nationalBirthDate"
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
                                onChange={handleInputChange}
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
                                วันที่เกิด :
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกวัน
                                </option>
                                {days.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </select>
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                เดือนที่เกิด:
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกเดือน
                                </option>
                                {MONTH_TH_MINI.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </select>
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                ปีที่เกิด
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกปี
                                </option>
                                {yearExpire.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
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
                                บ้านเลขที่ :
                              </label>
                              <input
                                type="input"
                                name="homeNo"
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
                                onChange={handleInputChange}
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
                                name="soi"
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
                                onChange={handleInputChange}
                              />
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                หมู่ที่ :
                              </label>
                              <input
                                type="input"
                                name="mooNo"
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
                                onChange={handleInputChange}
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
                                name="road"
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
                                onChange={handleInputChange}
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </nav>

                    <nav className="p-3">
                      <div className="container flex flex-wrap justify-between mx-auto">
                        <div className="flex md:order-2">
                          <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent "></ul>
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
                                name="mooBan"
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
                                onChange={handleInputChange}
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
                                onChange={handleSelectProvince}
                                defaultValue={allProvince[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={allProvince[0]}
                                  value={allProvince[0]}
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
                                onChange={handleSelectAmphur}
                                defaultValue={filterAmphure[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกอำเภอ
                                </option>
                                {filterAmphure.map((item: any) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name_th}
                                  </option>
                                ))}
                              </select>
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                แขวง / ตำบล :
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกตำบล
                                </option>
                                {filterTumbol.map((item: any) => (
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

                    <nav className="p-3">
                      <div className="container flex flex-wrap justify-between mx-auto">
                        <div className="flex md:order-2">
                          <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                วันที่ออกบัตร :
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกวัน
                                </option>
                                {days.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </select>
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                เดือนที่ออกบัตร :
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกเดือน
                                </option>
                                {MONTH_TH_MINI.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </select>
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                ปีที่ออกบัตร
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกปี
                                </option>
                                {yearIssue.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
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
                                วันที่หมดอายุ :
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกวัน
                                </option>
                                {days.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </select>
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                เดือนที่หมดอายุ :
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกเดือน
                                </option>
                                {MONTH_TH_MINI.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </select>
                            </li>

                            <li>
                              <label
                                htmlFor="large-input"
                                className="block  text-start text-sm  text-gray-900"
                              >
                                ปีที่หมดอายุ
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
                                defaultValue={filterTumbol[0]}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกปี
                                </option>
                                {yearExpire.map((item: any) => (
                                  <option key={item} value={item}>
                                    {item}
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
                      GENERATE
                    </button>
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
                  บัตรประชาชน :
                </h1>

                <br />

                <ul>
                  <div className="container">
                    <img
                      src={ThaiIdCardTemplate}
                      alt="Snow"
                      style={{ width: "100%" }}
                    />
                    <div className="top-left id-card-font numbers">
                      {values.idCard}
                    </div>
                    <div className="top-left-name id-card-font numbers">
                      {values.titleName} {values.firstName} {values.lastName}
                    </div>
                    <div className="top-left-first-name-en en-name numbers">
                      xxxxx
                    </div>
                    <div className="top-left-last-name-en en-name numbers">
                      xxxxx
                    </div>
                    <div className="top-right">Top Right</div>
                    <div className="bottom-right">
                      <img className="image-preview" src={WomenPreviewImage} />
                    </div>
                    <div className="position-birth-date id-card-font birth-date">
                      Birth date
                    </div>
                    <div className="position-address id-card-font birth-date">
                      164/30 ภ.คอนกรีต แขวงบางรัก
                    </div>
                    <div className="position-address-province id-card-font birth-date">
                      เขตภาษีเจริญ กรุงเทพมหานคร
                    </div>

                    <div className="position-expire-date id-card-font birth-date">
                      4 ม.ค. 2573
                    </div>

                    <div className="position-expire-date-en id-card-font birth-date en-name">
                      4 Jan 2573
                    </div>

                    <div className="position-issue-date id-card-font birth-date">
                    4 ม.ค. 2573
                    </div>

                    <div className="position-issue-date-en id-card-font birth-date en-name">
                    4 Jan 2573
                    </div>

                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockIdCard;
