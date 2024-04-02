import React, { useState } from "react";
import SuccessImage from "../../assets/images/check.png";
import FailImage from "../../assets/images/cross.png";
import "./RandomThaiIdCard.css";

type Props = {};

const IdCardGenerator = (props: Props) => {
  const cardType = [
    { name: "บัตรประชาชนคนไทย", value: "01" },
    { name: "บัตรประชาชนคนต่างด้าว", value: "00" },
  ];

  const alienCardType = [
    {
      name: "กลุ่มคนเลขนำหน้า 00",
      value: "00",
    },
    {
      name: "กลุ่มคนเลขนำหน้า 60",
      value: "60",
    },
    {
      name: "กลุ่มคนเลขนำหน้า 80",
      value: "80",
    },
  ];

  const sectorNumbers = [
    {
      name: "00",
      type: [
        {
          name: "00 - คนซึ่งไม่มีสัญชาติไทยที่ไม่อาจมีชื่อในทะเบียนบ้านและคนที่ไม่มี สถานะทางทะเบียนแจ้งเกิด",
          value: "00",
        },
        {
          name: "89 - คนที่ไม่มีสถานะทางทะเบียนได้รับการเพิ่มชื่อในทะเบียนประวัติโดย การสำรวจตามยุทธศาสตร์",
          value: "89",
        },
      ],
    },
    {
      name: "60",
      type: [
        {
          name: "00 - คนต่างด้าวอนุญาต เข้าอยู่ได้ชั่วคราว (VISA)",
          value: "00",
        },
        { name: "50 - คนพื้นที่ราบสูง", value: "50" },
        { name: "51 - อดีตทหารจีนคณะชาติ", value: "51" },
        { name: "52 - จีนฮ่ออพยพ", value: "52" },
        { name: "53 - จีนฮ่ออิสระ", value: "53" },
        { name: "54 - ผู้ผลัดถิ่นสัญชาติพม่า", value: "54" },
        {
          name: "55 - ผู้หลบหนีเข้าเมืองจากพม่าที่มีที่อาศัยเป็นของตนเอง",
          value: "55",
        },
        {
          name: "56 - ผู้หลบหนีเข้าเมืองจากพม่าที่อาศัยอยู่กับนายจ้าง",
          value: "56",
        },
        { name: "57 - ญวนอพยพ", value: "57" },
        { name: "58 - ลาวอพยพ", value: "58" },
        { name: "59 - เนปาลอพยพ", value: "59" },
        { name: "60 - อดีตโจรจีนคอมมิวนิสต์มลายา", value: "60" },
        { name: "61 - ไทยลื้อ", value: "61" },
        { name: "62 - มลาบีหรือตองเหลือง", value: "62" },
        {
          name: "63 - ผู้อพยพเชื้อสายไทยจากจังหวัดเกาะกง กัมพูชา",
          value: "63",
        },
        { name: "64 - ผู้หลบหนีชาวกัมพูชาเชื้อสายไทย", value: "64" },
        { name: "65 - ผู้หลบหนีเข้าเมืองจากกัมพูชา", value: "65" },
        {
          name: "66 - ผู้พลัดถิ่นสัญชาติพม่าเชื้อสายไทย (เข้ามาในไทยก่อนวันที่ 9 มีนาคม 2519)",
          value: "66",
        },
        {
          name: "67 - ผู้พลัดถิ่นสัญชาติพม่าเชื้อสายไทย (เข้ามาในไทยหลังวันที่ 9 มีนาคม 2519)",
          value: "67",
        },
        { name: "68 - ม้งถ้ำกระบอก", value: "68" },
        { name: "71 - ชุมชนบนพื้นที่สูงที่เป็นชาวเขา 9 เผ่า", value: "71" },
        { name: "72 - ชุมชนบนพื้นที่สูงที่ไม่ใช่ชาวเขา 9 เผ่า", value: "72" },
        { name: "73 - กลุ่มแรงงานต่างด้าวผิดกฎหมาย", value: "73" },
      ],
    },
    {
      name: "80",
      type: [
        {
          name: "00 - คนต่างด้าวที่ได้รับอนุญาตให้มีถิ่นที่อยู่ถาวรในประเทศไทย",
          value: "00",
        },
        {
          name: "73 - บุคคลที่ได้รับการลงรายการสัญชาติไทยในทะเบียนบ้านตามมาตรา 23",
          value: "73",
        },
        {
          name: "76 - บุคคลบนพื้นที่สูงได้สัญชาติไทยตามมาตรา 7 ทวิ",
          value: "76",
        },
        { name: "77 - จีนฮ่ออิสระที่ได้สัญชาติไทยตามมาตรา 7 ทวิ", value: "77" },
        {
          name: "78 - ผู้พลัดถิ่นสัญชาติพม่าที่ได้สัญชาติไทยตามมาตรา 7 ทวิ",
          value: "78",
        },
        { name: "79 - เนปาลที่ได้สัญชาติไทยตามมาตรา 7 ทวิ", value: "79" },
        { name: "81 - ลาวอพยพที่ได้สัญชาติไทยโดยการแปลงสัญชาติ", value: "81" },
        {
          name: "82 - อดีตโจรจีนคอมมิวนิสต์มลายาที่ได้สัญชาติไทยตามมาตรา 7 ทวิ",
          value: "82",
        },
        {
          name: "84 - ชนกลุ่มน้อยที่ได้ลงรายการสัญชาติไทยในทะเบียนบ้านตามระเบียบ",
          value: "84",
        },
        { name: "85 - ไทยลื้อที่ได้สัญชาติไทยตามมาตรา 7 ทวิ", value: "85" },
        { name: "86 - จีนฮ่ออพยพที่ได้สัญชาติไทยตามมาตรา 7 ทวิ", value: "86" },
        {
          name: "87 - อดีตทหารจีนคณะชาติที่ได้สัญชาติไทยตามมาตรา 7 ทวิ",
          value: "87",
        },
        { name: "88 - ญวนอพยพที่ได้สัญชาติไทยตามมาตรา 7 ทวิ", value: "88" },
      ],
    },
  ];

  const [showAlien, setShowAlien] = useState(false);
  const [sectorNumber, setSectorNumber] = useState(sectorNumbers[0].type);

  const [getAlienType, setAlienType] = useState("00");
  const [getSectorValue, setSectorNumberValue] = useState("00");
  const [result, setResult] = useState("0000000000000");
  const [verify, setVerify] = useState("");

  const handleCardType = (event$: any) => {
    const type = event$.target.value;
    if (type === "00") {
      setShowAlien(true);
    } else {
      setShowAlien(false);
    }
  };

  const handleAlienCardType = (event$: any) => {
    const alien = event$.target.value;
    const filterValue: any = sectorNumbers.find((values) => {
      return values.name === alien;
    });

    setAlienType(alien);
    setSectorNumber(filterValue.type);
  };

  const handleSectorNumber = (event$: any) => {
    const sector = event$.target.value;
    setSectorNumberValue(sector);
  };

  const ransomIdCard = () => {
    let digit1 = 0;
    let digit2 = 0;

    let digit6 = 0;
    let digit7 = 0;

    if (!showAlien) {
      digit1 = Math.floor(Math.random() * 9) + 1;
      digit2 = Math.floor(Math.random() * 10);

      digit6 = Math.floor(Math.random() * 10);
      digit7 = Math.floor(Math.random() * 10);
    } else {
      digit1 = Number(getAlienType.charAt(0));
      digit2 = Number(getAlienType.charAt(1));

      digit6 = Number(getSectorValue.charAt(0));
      digit7 = Number(getSectorValue.charAt(1));
    }

    const digit3 = Math.floor(Math.random() * 10);
    const digit4 = Math.floor(Math.random() * 10);
    const digit5 = Math.floor(Math.random() * 10);
    const digit8 = Math.floor(Math.random() * 10);
    const digit9 = Math.floor(Math.random() * 10);
    const digit10 = Math.floor(Math.random() * 10);
    const digit11 = Math.floor(Math.random() * 10);
    const digit12 = Math.floor(Math.random() * 10);
    let digit13;
    let number13 =
      11 -
      ((digit1 * 13 +
        digit2 * 12 +
        digit3 * 11 +
        digit4 * 10 +
        digit5 * 9 +
        digit6 * 8 +
        digit7 * 7 +
        digit8 * 6 +
        digit9 * 5 +
        digit10 * 4 +
        digit11 * 3 +
        digit12 * 2) %
        11);

    if (number13 >= 10) {
      digit13 = number13 - 10;
    } else {
      digit13 = number13;
    }

    const cid = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}${digit7}${digit8}${digit9}${digit10}${digit11}${digit12}${digit13}`;
    setResult(cid);
  };

  const verifyIdCard = () => {
    const id: any = result;
    if (id === null || id.length !== 13 || !/^[0-9]\d+$/.test(id)) {
      return false;
    }

    let i,
      sum = 0;
    for (i = 0, sum = 0; i < 12; i++) {
      sum += Number(id.charAt(i)) * (13 - i);
    }

    let check = (11 - (sum % 11)) % 10;
    if (check === Number(id.charAt(12))) {
      return true;
    }
    return false;
  };

  const onRandomIdCard = () => {
    ransomIdCard();
    setVerify("");
  };

  const onVerifyIdCard = () => {
    if (verifyIdCard()) {
      setVerify("success");
    } else {
      setVerify("fail");
    }
  };

  return (
    <div className="p-4 place-items-center w-full h-screen">
      <div className="flex flex-col">
        <div className="flex justify-between">
          {/* <div>Random thai id card</div> */}
          <label
            htmlFor="Random"
            className="block 
              mb-2 
              text-lg 
              font-medium 
              text-gray-600 
              dark:text-gray-300"
          >
            Random thai id card
          </label>
        </div>
        <div>
          <div
            className="block 
              p-4 
              w-full 
              border 
              border-solid
              border-gray-300 
              rounded-lg 
              bg-gray-50
              text-gray-600
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-white
              "
          >
            <div className="grid place-items-center">
              <div className="p-3">
                <div className="container flex flex-wrap items-center mx-auto">
                  <input
                    type="text"
                    id="idCard"
                    name="idCard"
                    className="
                    block
                    bg-gray-50
                    border
                    border-solid
                    border-gray-300
                    text-gray-600
                    text-md
                    min-w-[200px]
                    max-w-[400px]
                    p-2
                    shadow-md
                    rounded-md
                    dark:bg-gray-700
                    dark:border-gray-600
                    dark:placeholder-gray-400
                    dark:text-white
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="p-4 place-items-center">
    //   <div className="max-w-7xl mx-auto grid grid-cols-12 h-screen">
    //     <div className="col-span-12">
    //       <div>
    //         <div className="p-2">
    //           <div>
    //             <div
    //               id="message"
    //               className="
    //                   block
    //                   p-4
    //                   w-full
    //                   text-sm
    //                   text-gray-900
    //                   bg-gray-50
    //                   rounded-lg
    //                   border
    //                   border-gray-300
    //                   border-dashed border-2 border-gray-300
    //                   "
    //             >
    //               <div className="grid place-items-center">
    //                 <nav className="p-3">
    //                   <div className="container flex flex-wrap items-center justify-between mx-auto">
    //                     <div className="flex md:order-2">
    //                       <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
    //                         <li>
    //                           <h1 className="font-bold">
    //                             <label
    //                               htmlFor="large-input"
    //                               className="block mb-2 text-sm  text-gray-900"
    //                             >
    //                               ประเภท :
    //                             </label>
    //                             <select
    //                               className="inline-block
    //                                           text-sm
    //                                           px-3
    //                                           py-2
    //                                           leading-none
    //                                           border
    //                                           rounded
    //                                           text-black
    //                                           border-gray-800
    //                                           hover:bg-white
    //                                           mt-4
    //                                           lg:mt-0"
    //                               onChange={handleCardType}
    //                             >
    //                               {cardType.map((option) => (
    //                                 <option
    //                                   key={option.name}
    //                                   value={option.value}
    //                                 >
    //                                   {option.name}
    //                                 </option>
    //                               ))}
    //                             </select>
    //                           </h1>
    //                         </li>

    //                         {showAlien ? (
    //                           <>
    //                             <li>
    //                               <h1 className="font-bold">
    //                                 <label
    //                                   htmlFor="large-input"
    //                                   className="block mb-2 text-sm  text-gray-900"
    //                                 >
    //                                   กลุ่มบุคคล :
    //                                 </label>
    //                                 <select
    //                                   className="inline-block
    //                                            text-sm
    //                                            px-3
    //                                            py-2
    //                                            leading-none
    //                                            border
    //                                            rounded
    //                                            text-black
    //                                            border-gray-800
    //                                            hover:bg-white
    //                                            mt-4
    //                                            lg:mt-0"
    //                                   onChange={handleAlienCardType}
    //                                 >
    //                                   {alienCardType.map((option) => (
    //                                     <option
    //                                       key={option.name}
    //                                       value={option.value}
    //                                     >
    //                                       {option.name}
    //                                     </option>
    //                                   ))}
    //                                 </select>
    //                               </h1>
    //                             </li>

    //                             <li>
    //                               <h1 className="font-bold">
    //                                 <label
    //                                   htmlFor="large-input"
    //                                   className="block mb-2 text-sm  text-gray-900"
    //                                 >
    //                                   เลขประจำหลักที่ 6-7 :
    //                                 </label>
    //                                 <select
    //                                   className="inline-block
    //                                               text-sm
    //                                               px-3
    //                                               py-2
    //                                               leading-none
    //                                               border
    //                                               rounded
    //                                               text-black
    //                                               border-gray-800
    //                                               hover:bg-white
    //                                               mt-4
    //                                               lg:mt-0"
    //                                   onChange={handleSectorNumber}
    //                                 >
    //                                   {sectorNumber.map((option) => (
    //                                     <option
    //                                       key={option.name}
    //                                       value={option.value}
    //                                     >
    //                                       {option.name}
    //                                     </option>
    //                                   ))}
    //                                 </select>
    //                               </h1>
    //                             </li>
    //                           </>
    //                         ) : null}
    //                       </ul>
    //                     </div>
    //                   </div>
    //                 </nav>
    //               </div>
    //             </div>
    //           </div>

    //           <div
    //             id="message"
    //             className="
    //                   mt-5
    //                   block
    //                   p-4
    //                   w-full
    //                   text-sm
    //                   text-gray-900
    //                   bg-gray-50
    //                   rounded-lg
    //                   border
    //                   border-gray-300
    //                   border-dashed border-2 border-gray-300
    //                   grid place-items-center h-full mt-5
    //                   "
    //           >
    //             <h1 className="text-xl font-bold text-gray-900">
    //               หมายเลขบัตรประชาชน : {result}{" "}
    //             </h1>
    //             {!!verify && verify === "success" ? (
    //               <span className="text-green-500">
    //                 {" "}
    //                 <img
    //                   src={SuccessImage}
    //                   className="h-5 w-5 image-verify"
    //                 />{" "}
    //                 เลขบัตรประชาชนถูกต้อง{" "}
    //               </span>
    //             ) : (
    //               <>
    //                 {!!verify && verify === "fail" ? (
    //                   <>
    //                     <span className="text-red-500">
    //                       {" "}
    //                       <img
    //                         src={FailImage}
    //                         className="h-5 w-5 image-verify"
    //                       />{" "}
    //                       เลขบัตรประชาชนไม่ถูกต้อง{" "}
    //                     </span>
    //                   </>
    //                 ) : null}
    //               </>
    //             )}
    //           </div>

    //           <div>
    //             <div className="grid place-items-center h-full mt-5">
    //               <div className="inline-flex rounded-md shadow-sm">
    //                 <button
    //                   className="
    //                     text-white
    //                     bg-neutral-400
    //                     bg-green-500
    //                     hover:bg-[#FF9119]/80
    //                     focus:ring-4
    //                     focus:outline-none
    //                     focus:ring-[#FF9119]/50
    //                     font-medium
    //                     rounded-lg
    //                     text-sm
    //                     px-5
    //                     py-2.5
    //                     text-center
    //                     inline-flex
    //                     items-center
    //                     dark:hover:bg-[#FF9119]/80
    //                     dark:focus:ring-[#FF9119]/40
    //                     mr-1
    //                     mb-1"
    //                   onClick={onVerifyIdCard}
    //                 >
    //                   ตรวจสอบ
    //                 </button>

    //                 <button
    //                   className="
    //                     text-white
    //                     bg-neutral-400
    //                     bg-blue-500
    //                     hover:bg-[#FF9119]/80
    //                     focus:ring-4
    //                     focus:outline-none
    //                     focus:ring-[#FF9119]/50
    //                     font-medium
    //                     rounded-lg
    //                     text-sm
    //                     px-5
    //                     py-2.5
    //                     text-center
    //                     inline-flex
    //                     items-center
    //                     dark:hover:bg-[#FF9119]/80
    //                     dark:focus:ring-[#FF9119]/40
    //                     mr-1
    //                     mb-1"
    //                   onClick={onRandomIdCard}
    //                 >
    //                   สุ่ม
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default IdCardGenerator;
