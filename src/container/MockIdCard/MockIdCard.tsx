import React, { useEffect, useState } from "react";
import axios from "axios";
import ThaiIdCardTemplate from "../../assets/images/blank_id_card.png";

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
import sharedService from "../../components/shared/share-api";
import { useSelector } from "react-redux";

import WomenPreviewImage from "../../assets/images/person/removebg-preview.png";
import WomenPreviewImage2 from "../../assets/images/person/remove-bg-mock.png";
import WomenPreviewImage3 from "../../assets/images/person/women_001.png";
import WomenPreviewImage4 from "../../assets/images/person/women_002.png";

import MenPreviewImage from "../../assets/images/person/men-removebg-preview.png";
import MenPreviewImage2 from "../../assets/images/person/men_001.png";
import MenPreviewImage3 from "../../assets/images/person/men_002.png";

type Props = {};

const userDataObject = {
  titleName: "",
  firstName: "",
  lastName: "",
  firstNameEN: "",
  lastNameEN: "",
  birthDate: "",
  birthDateEN: "",
  idCard: "",
  nationalBirthDate: "",
  homeNo: "",
  soi: "",
  tumbol: "",
  mooNo: "",
  road: "",
  mooBan: "",
  region: "",
  province: "",
  firstAddress: "",
  secondAddress: "",
  issueDate: "",
  issueDateEN: "",
  expireDate: "",
  expireDateEN: "",
  imagePath: "",
};

const provinceData = {
  created_at: "",
  deleted_at: "",
  id: 0,
  name_en: "",
  name_th: "",
  province_id: 1,
  updated_at: "",
};

const MockIdCard = (props: Props) => {
  const provinceReducer: any = useSelector(provinceSelector);
  const amphureReducer: any = useSelector(amphureSelector);
  const tumbolReducer: any = useSelector(tumbolSelector);
  const dispatch = useAppDispatch();

  const photoPreview = [
    {
      value: "รูปผู้ชายใส่เสื้อสีดำ",
      path: MenPreviewImage,
    },
    {
      value: "รูปผู้ชายใส่ผมทองใส่ต่างหู",
      path: MenPreviewImage2,
    },
    {
      value: "รูปผู้ชายผมยาวมีหนวดเคราสวมเสื้อบอล",
      path: MenPreviewImage3,
    },
    {
      value: "รูปผู้หญิงรัดผมใส่เสื้อสูทสีเทา",
      path: WomenPreviewImage,
    },
    {
      value: "รูปผู้หญิงผมยาวใส่เสื้อสีขาว",
      path: WomenPreviewImage2,
    },
    {
      value: "รูปผู้หญิงผมสีทองใส่เสื้อลาย",
      path: WomenPreviewImage3,
    },
    {
      value: "รูปผู้หญิงผมยาวปิดใบหน้า",
      path: WomenPreviewImage4,
    },
  ];

  const MONTH_TH = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

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

  const MONTH = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
  const [yearOfBirth, setYearOfBirth] = useState([]);
  const [days, setDays] = useState([]);
  const [allProvince, setAllProvince] = useState([]);
  const [filterAmphure, setFilterAmphure] = useState([]);
  const [filterTumbol, setFilterTumbol] = useState([]);
  const [values, setValues] = useState(userDataObject);

  const [province, setProvince] = useState(provinceData);
  const [amphur, setAmphur] = useState(provinceData);
  const [tumbol, setTumbol] = useState(provinceData);

  const [customer, setCustomer] = useState(userDataObject);
  const [firstAddress, setFirstAddress] = useState("");
  const [secondeAddress, setSecondAddress] = useState("");

  const [dayBirth, setDayBirth] = useState("");
  const [monthBirth, setMonthBirth] = useState("");
  const [monthBirthEN, setMonthBirthEN] = useState("");
  const [yearBirth, setYearBirth] = useState("");

  const [selectDateIssue, setSelectDateIssue] = useState("");
  const [selectMonthIssue, setSelectMonthIssue] = useState("");
  const [selectMonthIssueEN, setSelectMonthIssueEN] = useState("");
  const [selectYearIssue, setSelectYearIssue] = useState("");

  const [selectDateExpire, setSelectDateExpire] = useState("");
  const [selectMonthExpire, setSelectMonthExpire] = useState("");
  const [selectMonthExpireEN, setSelectMonthExpireEN] = useState("");
  const [selectYearExpire, setSelectYearExpire] = useState("");

  const [generate, setGenerate] = useState(false);
  const [images, setImage] = useState("");

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
    getYearOfDate();
    getDays();
  }, []);

  const getYearIssue = () => {
    let YEAR_ISSUE: any = [];
    let min = new Date().getFullYear() - 100 + 543;
    let max = min + 100;
    for (let i = min; i <= max; i++) {
      YEAR_ISSUE.push(i);
    }
    setYearIssue(YEAR_ISSUE);
  };

  const getYearExpire = () => {
    let YEAR_EXPIRE: any = [];
    let min = new Date().getFullYear() + 543;
    let max = min + 100;
    for (let i = min; i <= max; i++) {
      YEAR_EXPIRE.push(i);
    }
    setYearExpire(YEAR_EXPIRE);
  };

  const getYearOfDate = () => {
    let YEAR_DATE: any = [];
    let min = new Date().getFullYear() - 100 + 543;
    let max = min + 100;
    for (let i = min; i <= max; i++) {
      YEAR_DATE.push(i);
    }
    setYearOfBirth(YEAR_DATE);
  };

  const getDays = () => {
    let days: any = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    setDays(days);
  };

  const handleInputChange = ($event: any) => {
    const { name, value } = $event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleDayBirth = ($event: any) => {
    MONTH_MINI;
    const birth: any = $event.target;
    console.log("day", MONTH_TH_MINI[Number(birth.value)]);
    setDayBirth(birth.value);
  };

  const handleMonthBirth = ($event: any) => {
    const month: any = $event.target;
    // setMonthBirth(birth.value);
    console.log("month", month.value);
    setMonthBirth(MONTH_TH_MINI[Number(month.value)]);
    setMonthBirthEN(MONTH_MINI[Number(month.value)]);
  };

  const handleYearBirth = ($event: any) => {
    const birth: any = $event.target;
    setYearBirth(birth.value);
  };

  const handleDateIssue = ($event: any) => {
    const date = $event.target;
    console.log("date issue", date.value);
    setSelectDateIssue(date.value);
  };

  const handleMonthIssue = ($event: any) => {
    const month = $event.target;
    // setSelectMonthIssue(month.value);
    setSelectMonthIssue(MONTH_TH_MINI[Number(month.value)]);
    setSelectMonthIssueEN(MONTH_MINI[Number(month.value)]);
  };

  const handleYearIssue = ($event: any) => {
    const year = $event.target;
    console.log("year issue", year.value);
    setSelectYearIssue(year.value);
  };

  const handleDateExpire = ($event: any) => {
    const date = $event.target;
    console.log("data expire", date.value);
    setSelectDateExpire(date.value);
  };

  const handleMonthExpire = ($event: any) => {
    const month = $event.target;
    console.log("month expire", month.value);
    // setSelectMonthExpire(month.value);
    setSelectMonthExpire(MONTH_TH_MINI[Number(month.value)]);
    setSelectMonthExpireEN(MONTH_MINI[Number(month.value)]);
  };

  const handleYearExpire = ($event: any) => {
    const year = $event.target;
    console.log("year expire", year.value);
    setSelectYearExpire(year.value);
  };

  const handleSelectProvince = ($event: any) => {
    const provinceId = $event.target.value;
    const filterAmphure = amphureReducer.amphure.amphure.filter(
      (item: any) => Number(item.province_id) === Number(provinceId)
    );

    const getProvince = provinceReducer.province.province.find(
      (item: any) => item.id === Number(provinceId)
    );

    console.log("province", getProvince);

    setProvince(getProvince);
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
    const getAmphur = amphureReducer.amphure.amphure.find(
      (item: any) => item.id == Number(amphurId)
    );

    setAmphur(getAmphur);
    findTumbol(amphurId);
  };

  const handleSelectTumbol = ($event: any) => {
    const tumbolId = $event.target.value;
    const getTumbols = tumbolReducer.tumbol.tumbol.find(
      (item: any) => item.id == Number(tumbolId)
    );
    setTumbol(getTumbols);
  };

  const handleSelectImage = ($event: any) => {
    const image = $event.target;
    setImage(image.value);
  };

  const onClickGenerate = () => {
    const idCard = values.idCard.split("");
    let transformText;

    if (values.idCard) {
      transformText =
        idCard[0] +
        " " +
        idCard[1] +
        idCard[2] +
        idCard[3] +
        idCard[4] +
        " " +
        idCard[5] +
        idCard[6] +
        idCard[7] +
        idCard[8] +
        idCard[9] +
        " " +
        idCard[10] +
        idCard[11] +
        " " +
        +idCard[12];
    }

    const birthDate = dayBirth + " " + monthBirth + " " + yearBirth;
    const issueDate =
      selectDateIssue + " " + selectMonthIssue + " " + selectYearIssue;
    const expireDate =
      selectDateExpire + " " + selectMonthExpire + " " + selectYearExpire;

    const birthDateEN = dayBirth + " " + monthBirthEN + " " + yearBirth;
    const issueDateEN =
      selectDateIssue + " " + selectMonthIssueEN + " " + selectYearIssue;
    const expireDateEN =
      selectDateExpire + " " + selectMonthExpireEN + " " + selectYearExpire;

    let firstAddress: string = "";
    let secondAddress: string = "";

    if (province.name_en === "Bangkok") {
      firstAddress += `${values.homeNo} `;
      firstAddress += values.mooBan ? `${values.mooBan} ` : " ";
      firstAddress += values.mooNo ? `หมู่ที่ ${values.mooNo} ` : " ";
      firstAddress += values.soi ? "ซ." + `${values.soi} ` : " ";
      firstAddress += values.road ? "ถ." + `${values.road} ` : " ";
      firstAddress += `แขวง${tumbol.name_th} `;

      secondAddress += amphur ? `${amphur.name_th} ` : " ";
      secondAddress += province.name_th;

      // setFirstAddress(firstAddress);
      // setSecondAddress(secondAddress);
    } else {
      firstAddress += `${values.homeNo} `;
      firstAddress += values.mooBan ? `${values.mooBan} ` : "";
      firstAddress += values.mooNo ? `หมู่ที่ ${values.mooNo} ` : "";
      firstAddress += values.soi ? "ซ." + `${values.soi} ` : "";
      firstAddress += values.road ? "ถ." + `${values.road} ` : "";
      firstAddress += `ต.${tumbol.name_th} `;

      secondAddress += amphur ? `อ.${amphur.name_th} ` : "";
      secondAddress += province ? `จ.${province.name_th}` : "";
    }

    const data: any = {
      titleName: values.titleName,
      firstName: values.firstName ? values.firstName : undefined,
      lastName: values.lastName ? values.lastName : undefined,
      firstNameEN: values.firstNameEN ? values.firstNameEN : undefined,
      lastNameEN: values.lastNameEN ? values.lastNameEN : undefined,
      region: values.region ? values.region : undefined,
      homeNo: values.homeNo ? values.homeNo : undefined,
      soi: values.soi ? values.soi : undefined,
      mooNo: values.mooNo ? values.mooNo : undefined,
      road: values.road ? values.road : undefined,
      mooBan: values.mooBan ? values.mooBan : undefined,
      idCard: transformText ? transformText : undefined,
      birthDate: birthDate ? birthDate : undefined,
      birthDateEN: birthDateEN ? birthDateEN : undefined,
      issueDate: issueDate ? issueDate : undefined,
      issueDateEN: issueDateEN ? issueDateEN : undefined,
      expireDate: expireDate ? expireDate : undefined,
      expireDateEN: expireDateEN ? expireDateEN : undefined,
      firstAddress: firstAddress ? firstAddress : undefined,
      secondAddress: secondAddress ? secondAddress : undefined,
      imagePath: images ? images : "",
    };

    setCustomer(data);
    setGenerate(true);
  };

  return (
    <div className="p-4 place-items-center bg-primary">
      <div className="max-w-7xl mx-auto grid grid-cols-12 h-screen bg-primary">
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
                                autoFocus={true}
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
                                เลขประจำตัวประชาชน :
                              </label>
                              <input
                                type="number"
                                name="idCard"
                                maxLength={13}
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
                                ชื่อ (อังกฤษ) :
                              </label>
                              <input
                                type="input"
                                name="firstNameEN"
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
                                name="lastNameEN"
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
                                onChange={handleDayBirth}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกวัน
                                </option>
                                {days.map((item: any) => (
                                  <option key={item}>{item}</option>
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
                                onChange={handleMonthBirth}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกเดือน
                                </option>
                                {MONTH_TH_MINI.map(
                                  (item: any, index: number) => (
                                    <option key={item} value={index}>
                                      {item}
                                    </option>
                                  )
                                )}
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
                                onChange={handleYearBirth}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกปี
                                </option>
                                {yearOfBirth.map((item: any) => (
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
                                ศาสนา :
                              </label>
                              <input
                                type="input"
                                name="region"
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
                                onChange={handleSelectTumbol}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกตำบล
                                </option>
                                {filterTumbol.map((item: any) => (
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
                                onChange={handleDateIssue}
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
                                onChange={handleMonthIssue}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกเดือน
                                </option>
                                {MONTH_TH_MINI.map(
                                  (item: any, index: number) => (
                                    <option key={item} value={index}>
                                      {item}
                                    </option>
                                  )
                                )}
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
                                onChange={handleYearIssue}
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
                                onChange={handleDateExpire}
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
                                onChange={handleMonthExpire}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกเดือน
                                </option>
                                {MONTH_TH_MINI.map(
                                  (item: any, index: number) => (
                                    <option key={item} value={index}>
                                      {item}
                                    </option>
                                  )
                                )}
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
                                onChange={handleYearExpire}
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
                                รูปบัตรประชาชน :
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
                                onChange={handleSelectImage}
                              >
                                <option
                                  disabled={true}
                                  selected={true}
                                  value={0}
                                >
                                  กรุณาเลือกรูป
                                </option>
                                {photoPreview.map((item: any) => (
                                  <option key={item.value} value={item.path}>
                                    {item.value}
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
                      onClick={onClickGenerate}
                    >
                      GENERATE
                    </button>
                  </div>
                </div>
              </div>

              {generate ? (
                <>
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
                          {/* 1 2701 00029 24 4 */}
                          {customer.idCard}
                        </div>
                        <div className="top-left-name id-card-font numbers">
                          {customer.titleName} {customer.firstName}{" "}
                          {customer.lastName}
                        </div>
                        <div className="top-left-first-name-en en-name numbers">
                          {customer.firstNameEN}
                        </div>
                        <div className="top-left-last-name-en en-name numbers">
                          {customer.lastNameEN}
                        </div>
                        <div className="bottom-right">
                          <img
                            className="image-preview"
                            src={customer.imagePath}
                          />
                        </div>
                        <div className="position-birth-date id-card-font birth-date-large">
                          {customer.birthDate}
                        </div>

                        <div className="position-birth-of-date-en id-card-font birth-date-large en-name">
                          {customer.birthDateEN}
                        </div>

                        <div className="position-region id-card-font birth-date en-name">
                          {customer.region}
                        </div>

                        <div className="position-address id-card-font birth-date">
                          {/* 164/30 ภ.คอนกรีต แขวงบางรัก */}
                          {customer.firstAddress}
                        </div>
                        <div className="position-address-province id-card-font birth-date">
                          {customer.secondAddress}
                        </div>

                        <div className="position-expire-date id-card-font birth-date">
                          {customer.expireDate}
                        </div>

                        <div className="position-expire-date-en id-card-font birth-date en-name">
                          {customer.expireDateEN}
                        </div>

                        <div className="position-issue-date id-card-font birth-date">
                          {customer.issueDate}
                        </div>

                        <div className="position-issue-date-en id-card-font birth-date en-name">
                          {/* 4 Jan 2573 */}
                          {customer.issueDateEN}
                        </div>
                      </div>
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockIdCard;
