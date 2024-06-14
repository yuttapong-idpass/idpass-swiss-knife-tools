import React, { SyntheticEvent, useState } from "react";
import SuccessImage from "../../assets/images/check.png";
import FailImage from "../../assets/images/cross.png";
import "./RandomThaiIdCard.css";
import ToastNotify from "../../../components/ToastNotify/ToastNotify";
import { toast } from "react-toastify";
type Props = {};

const IdCardGenerator = (props: Props) => {
  const cardTypes = [
    { name: "บัตรประชาชนคนไทย", value: "thai" },
    { name: "บัตรประชาชนคนต่างด้าว", value: "alien" },
  ];

  const alienGroupType = [
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

  const [sectorNumber, setSectorNumber] = useState(sectorNumbers[0].type);
  const [cardType, setCardType] = useState(cardTypes[0].value);
  const [groupType, setGroupType] = useState("00");
  const [getSectorValue, setSectorNumberValue] = useState("00");
  const [result, setResult] = useState("0000000000000");
  const [verify, setVerify] = useState("");

  const handleCardType = (event$: SyntheticEvent<EventTarget>) => {
    const type = (event$.target as HTMLInputElement).value;
    setCardType(type);
  };

  const handleAlienGroupType = (event$: SyntheticEvent<EventTarget>) => {
    const alien = (event$.target as HTMLInputElement).value;
    const filterValue: any = sectorNumbers.find((values) => {
      return values.name === alien;
    });
    setGroupType(alien);
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

    if (cardType === "thai") {
      digit1 = Math.floor(Math.random() * 9) + 1;
      digit2 = Math.floor(Math.random() * 10);

      digit6 = Math.floor(Math.random() * 10);
      digit7 = Math.floor(Math.random() * 10);
    } else {
      digit1 = Number(groupType.charAt(0));
      digit2 = Number(groupType.charAt(1));

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
  };

  const onCopyIdCard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copies!");
    } catch (error) {
      console.log("error ->", error);
    }
  };

  return (
    <div className="p-4 place-items-center w-full h-screen bg-primary">
      <ToastNotify />
      <div className="flex flex-col">
        <div className="flex justify-between">
          <label
            htmlFor="Random"
            className="block 
              mb-2 
              text-lg 
              font-medium 
              text-primary
              "
          >
            Random thai id card
          </label>
        </div>
        <div>
          <div
            className="block 
              p-4 
              w-full 
              rounded-lg 
              bg-secondary
              "
          >
            <div className="flex flex-col">
              <div className="flex flex-row gap-4 self-center">
                <div>
                  <div>
                    <label htmlFor="idCard" className="text-primary">
                      ประเภทบัตร
                    </label>
                  </div>
                  <div>
                    <select
                      title="cardType"
                      name="cardType"
                      id="cardType"
                      className="
                  rounded-md
                  text-primary
                  bg-primary
                  p-2
                  shadow-lg
                  "
                      onChange={handleCardType}
                    >
                      {cardTypes.map((type, index) => (
                        <option key={index} value={type.value}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {cardType === "alien" ? (
                  <>
                    <div>
                      <div>
                        <label htmlFor="sector1" className="text-primary">
                          กลุ่มบุคคล
                        </label>
                      </div>
                      <div>
                        <select
                          name="sector1"
                          id="sector1"
                          title="sector1"
                          className="rounded-md
                          text-primary
                          bg-primary
                          p-2
                          shadow-lg
                        "
                          onChange={handleAlienGroupType}
                        >
                          {alienGroupType.map((group, index) => (
                            <option key={index} value={group.value}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label htmlFor="section2" className="text-primary">
                          เลขประจำหลัก 6-7
                        </label>
                      </div>
                      <div>
                        <select
                          name="sector2"
                          id="sector2"
                          title="sector2"
                          className="
                        rounded-md
                        shadow-lg
                        text-primary
                        bg-primary
                        p-2
                        shadow-2
                        "
                          onChange={handleSectorNumber}
                        >
                          {sectorNumber.map((sector, index) => (
                            <option key={index} value={sector.value}>
                              {sector.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="flex flex-row self-center mt-4 gap-4">
                <div>
                  <input
                    type="text"
                    id="secret"
                    value={result}
                    disabled={true}
                    className=" h-10 
                      p-2
                      rounded-md
                      shadow-md
                      bg-primary 
                      text-primary
                  "
                  />
                </div>
                <div>
                  <button
                    title="Pretty json"
                    className="
                      inline-flex 
                      w-full 
                      item-centers 
                      justify-center 
                      px-4 
                      py-2 
                      font-bold 
                      leading-6 
                      whitespace-no-wrap 
                      bg-success 
                      rounded-md 
                      shadow-sm
                      text-white
                      bg-yellow-500
                      dark:text-[#2d3748]
                      "
                    onClick={onRandomIdCard}
                  >
                    Random
                  </button>
                </div>
                <div>
                  <button
                    title="Pretty json"
                    className="
                      inline-flex 
                      w-full 
                      item-centers 
                      justify-center 
                      px-4 
                      py-2 
                      font-bold 
                      leading-6 
                      whitespace-no-wrap 
                      rounded-md 
                      shadow-sm
                      text-white
                      bg-violet-400
                      dark:text-[#2d3748]
                      "
                    onClick={onCopyIdCard}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCardGenerator;
