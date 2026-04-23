import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  RefreshCcw,
  CheckCircle2,
  User,
  MapPin,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import BlankIdCard from "@/assets/images/blank-id-card-remove-text.png";

type Sex = "ชาย" | "หญิง";

interface IdCardData {
  idNumber: string;
  prefixTh: string;
  firstNameTh: string;
  lastNameTh: string;
  prefixEn: string;
  firstNameEn: string;
  lastNameEn: string;
  dob: string;
  address: string;
  sex: Sex;
  religion: string;
}

const DEFAULT_DATA: IdCardData = {
  idNumber: "1 2345 67890 12 3",
  prefixTh: "นาย",
  firstNameTh: "ทดสอบ",
  lastNameTh: "ระบบ",
  prefixEn: "Mr.",
  firstNameEn: "Test",
  lastNameEn: "System",
  dob: "1995-05-20",
  address:
    "99/9 หมู่ที่ 9 ถนนทดสอบ ตำบลตัวอย่าง อำเภอจำลอง จังหวัดกรุงเทพมหานคร 10000",
  sex: "ชาย",
  religion: "พุทธ",
};

// แปลงเลขบัตร 13 หลักให้อยู่ในรูปแบบ "X XXXX XXXXX XX X"
// ถ้าไม่ใช่ตัวเลขล้วน หรือสั้น/ยาวกว่า 13 หลัก จะคืนค่าเดิม (ตัดเฉพาะอักขระที่ไม่ใช่ตัวเลข/ช่องว่าง)
const formatIdNumber = (raw: string): string => {
  const cleaned = raw.replace(/[^\d\s]/g, "");
  const digits = cleaned.replace(/\s/g, "");
  if (digits.length !== 13) return cleaned;
  return `${digits[0]} ${digits.slice(1, 5)} ${digits.slice(5, 10)} ${digits.slice(10, 12)} ${digits[12]}`;
};

const THAI_MONTHS = [
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

const EN_MONTHS = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];

const formatThaiDate = (iso: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const day = d.getDate();
  const month = THAI_MONTHS[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

const formatEnDate = (iso: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return `${d.getDate()} ${EN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const MockUpIdCard = () => {
  const [form, setForm] = useState<IdCardData>(DEFAULT_DATA);
  const [card, setCard] = useState<IdCardData>(DEFAULT_DATA);

  const handleChange = <K extends keyof IdCardData>(
    key: K,
    value: IdCardData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onApply = () => {
    setCard({ ...form, idNumber: formatIdNumber(form.idNumber) });
  };

  const onReset = () => {
    setForm(DEFAULT_DATA);
    setCard(DEFAULT_DATA);
  };

  const fullNameTh = useMemo(
    () => `${card.prefixTh}${card.firstNameTh}`,
    [card],
  );
  const fullNameEn = useMemo(
    () => `${card.prefixEn} ${card.firstNameEn}`,
    [card],
  );

  const issueDate = "2024-01-15";
  const expiryDate = "2032-01-14";

  return (
    <div className="flex flex-col w-full min-h-screen bg-background p-4 md:p-6 gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-primary">
          Mock Up Thai ID Card
        </h1>
        <p className="text-sm text-muted-foreground">
          เครื่องมือจำลองบัตรประชาชนสำหรับ QA / Software Tester
          ใช้ทดสอบการแสดงผลและการกรอกข้อมูลเท่านั้น
        </p>
      </div>

      <div
        role="alert"
        className="flex items-start gap-3 rounded-lg border border-red-400 bg-red-50 p-3 text-red-800 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800"
      >
        <AlertTriangle className="size-5 mt-0.5 shrink-0" />
        <div className="text-sm leading-relaxed">
          <p className="font-bold">
            ใช้สำหรับการทดสอบซอฟต์แวร์เท่านั้น (FOR TESTING PURPOSES ONLY)
          </p>
          <p>
            ข้อมูลและภาพบัตรนี้เป็นข้อมูลจำลอง (Mock Data)
            ที่สร้างขึ้นเพื่อการทดสอบระบบ ห้ามนำไปใช้แอบอ้างเป็นเอกสารราชการจริง
            ห้ามนำไปใช้ในทางที่ผิดกฎหมาย หรือกระทำการใด ๆ
            ที่ละเมิดสิทธิของผู้อื่น
            ผู้พัฒนาไม่มีส่วนรับผิดชอบต่อการนำไปใช้ผิดวัตถุประสงค์
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <User className="size-5" />
            <h2 className="font-semibold text-lg">แก้ไขข้อมูลบนบัตร</h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="idNumber" className="flex items-center gap-1.5">
              <CreditCard className="size-4" /> เลขประจำตัวประชาชน
            </Label>
            <Input
              id="idNumber"
              value={form.idNumber}
              onChange={(e) => handleChange("idNumber", e.target.value)}
              placeholder="1 2345 67890 12 3 (รองรับ 13 หลัก จะ format อัตโนมัติ)"
              inputMode="numeric"
              maxLength={17}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prefixTh">คำนำหน้า (ไทย)</Label>
              <Input
                id="prefixTh"
                value={form.prefixTh}
                onChange={(e) => handleChange("prefixTh", e.target.value)}
                placeholder="นาย / นาง / นางสาว"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstNameTh">ชื่อ (ไทย)</Label>
              <Input
                id="firstNameTh"
                value={form.firstNameTh}
                onChange={(e) => handleChange("firstNameTh", e.target.value)}
                placeholder="ชื่อจริง"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastNameTh">นามสกุล (ไทย)</Label>
              <Input
                id="lastNameTh"
                value={form.lastNameTh}
                onChange={(e) => handleChange("lastNameTh", e.target.value)}
                placeholder="นามสกุล"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prefixEn">Title (EN)</Label>
              <Input
                id="prefixEn"
                value={form.prefixEn}
                onChange={(e) => handleChange("prefixEn", e.target.value)}
                placeholder="Mr. / Mrs. / Miss"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstNameEn">First Name (EN)</Label>
              <Input
                id="firstNameEn"
                value={form.firstNameEn}
                onChange={(e) => handleChange("firstNameEn", e.target.value)}
                placeholder="First Name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastNameEn">Last Name (EN)</Label>
              <Input
                id="lastNameEn"
                value={form.lastNameEn}
                onChange={(e) => handleChange("lastNameEn", e.target.value)}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dob" className="flex items-center gap-1.5">
                <CalendarDays className="size-4" /> วันเกิด
              </Label>
              <Input
                id="dob"
                type="date"
                value={form.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sex">เพศ</Label>
              <select
                id="sex"
                value={form.sex}
                onChange={(e) => handleChange("sex", e.target.value as Sex)}
                className="border-input bg-transparent h-9 rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="religion">ศาสนา</Label>
              <Input
                id="religion"
                value={form.religion}
                onChange={(e) => handleChange("religion", e.target.value)}
                placeholder="พุทธ / คริสต์ / อิสลาม ..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address" className="flex items-center gap-1.5">
              <MapPin className="size-4" /> ที่อยู่
            </Label>
            <textarea
              id="address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={3}
              placeholder="บ้านเลขที่ หมู่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
              className="border-input bg-transparent rounded-md border px-3 py-2 text-sm shadow-xs outline-none resize-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onApply}
              className="gap-2"
              title="อัปเดตข้อมูลที่แสดงบนบัตร"
            >
              <CheckCircle2 className="size-4" />
              อัปเดตข้อมูลบนบัตร
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              className="gap-2"
              title="ล้างข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น"
            >
              <RefreshCcw className="size-4" />
              Reset
            </Button>
          </div>
        </section>

        <section className="flex flex-col items-center justify-start gap-3">
          <h2 className="font-semibold text-lg text-primary self-start">
            ตัวอย่างบัตร (Preview)
          </h2>
          <IdCardFront
            data={card}
            idNumber={card.idNumber}
            issueDate={issueDate}
            expiryDate={expiryDate}
            fullNameTh={fullNameTh}
            fullNameEn={fullNameEn}
          />
          <p className="text-xs text-muted-foreground text-center max-w-md">
            กดปุ่ม <span className="font-semibold">“อัปเดตข้อมูลบนบัตร”</span>{" "}
            เพื่อให้ข้อมูลในฟอร์มแสดงบนหน้าบัตร
          </p>
        </section>
      </div>
    </div>
  );
};

interface IdCardFrontProps {
  data: IdCardData;
  idNumber: string;
  issueDate: string;
  expiryDate: string;
  fullNameTh: string;
  fullNameEn: string;
}

const IdCardFront = ({
  data,
  idNumber,
  issueDate,
  expiryDate,
  fullNameTh,
  fullNameEn,
}: IdCardFrontProps) => {
  const watermarkRows = Array.from({ length: 7 });

  return (
    <div
      className="relative w-full max-w-[720px] rounded-xl overflow-hidden shadow-xl border border-slate-300 select-none bg-white"
      aria-label="Mock Thai ID Card Preview"
    >
      <img
        src={BlankIdCard}
        alt="Thai National ID Card background"
        className="block w-full h-auto pointer-events-none"
        draggable={false}
      />

      <div className="absolute inset-0 text-slate-900 font-[system-ui]">
        {/* Header title */}
        <div
          className="absolute text-left leading-tight"
          style={{ top: "3.5%", left: "18%", right: "4%" }}
        >
          <div className="font-bold text-xl sm:text-lg md:text-xl text-slate-900">
            บัตรประจำตัวประชาชน{" "}
            <span className="fond-bold text-blue-700">
              Thai National ID Card
            </span>
          </div>
          {/* <div className="font-semibold text-[8px] sm:text-[10px] md:text-[12px] text-slate-700">
            Thai National ID Card
          </div> */}
        </div>

        {/* Identification Number */}
        <div
          className="absolute leading-tight"
          style={{ top: "14%", left: "18%" }}
        >
          <div className="font-bold text-base sm:text-sm md:text-md text-slate-700 flex flex-row gap-1">
            <div className="flex flex-col items-center">
              <span className="font-bold">เลขประจำตัวประชาชน</span>
              <span className="text-blue-700 font-bold">
                Identification Number
              </span>
            </div>
            <div className="font-bold tracking-[0.12em] text-[11px] sm:text-[14px] md:text-[18px] text-slate-900">
              {idNumber}
            </div>
          </div>
        </div>

        {/* Name (Thai) */}
        <div
          className="absolute leading-tight"
          style={{ top: "25%", left: "13%" }}
        >
          <div className="text-base font-semibold sm:text-sm md:text-md text-slate-700">
            ชื่อตัวและชื่อสกุล
            <span className="ml-1 text-xl sm:text-base md:text-xl font-bold text-slate-700">
              {data.firstNameTh} {data.lastNameTh}
            </span>
          </div>
        </div>

        {/* Name (English) */}
        <div
          className="absolute leading-tight"
          style={{ top: "35%", left: "30%" }}
        >
          {/* <div className="text-[7px] sm:text-[9px] md:text-[11px] italic text-slate-600">
            Last name {data.lastNameEn}
          </div> */}
          <div className="font-bold text-base sm:text-sm md:text-md text-blue-800">
            Name{" "}
            <span className="ml-1 fond-semibold text-lg sm:text-md md:text-lg">
              {data.firstNameEn}
            </span>
          </div>
          <div className="font-bold text-base sm:text-sm md:text-md text-blue-800">
            Last name{" "}
            <span className="ml-1 fond-semibold text-lg sm:text-md md:text-lg">
              {data.lastNameEn}
            </span>
          </div>
        </div>

        {/* Date of Birth */}
        <div
          className="absolute leading-tight"
          style={{ top: "50%", left: "32%" }}
        >
          <div className="text-[7px] sm:text-[9px] md:text-[11px] text-slate-700">
            เกิดวันที่
            <span className="ml-1 italic text-slate-600">Date of Birth</span>
          </div>
          <div className="font-semibold text-[9px] sm:text-[11px] md:text-[13px] text-slate-900">
            {formatThaiDate(data.dob)}
            <span className="ml-2 italic font-normal text-slate-700 text-[8px] sm:text-[10px] md:text-[12px]">
              {formatEnDate(data.dob)}
            </span>
          </div>
        </div>

        {/* Religion + Sex */}
        <div
          className="absolute leading-tight"
          style={{ top: "53%", left: "18%" }}
        >
          <div className="text-[7px] sm:text-[9px] md:text-[11px] text-slate-700">
            ศาสนา
            <span className="ml-1 italic text-slate-600">Religion</span>
            <span className="ml-3">เพศ</span>
            <span className="ml-1 italic text-slate-600">Sex</span>
          </div>
          <div className="font-semibold text-[9px] sm:text-[11px] md:text-[13px] text-slate-900">
            {data.religion}
            <span className="ml-6 font-normal text-slate-800">{data.sex}</span>
          </div>
        </div>

        {/* Address */}
        <div
          className="absolute leading-snug"
          style={{ top: "61%", left: "18%", width: "58%" }}
        >
          <div className="text-[7px] sm:text-[9px] md:text-[11px] text-slate-700">
            ที่อยู่
            <span className="ml-1 italic text-slate-600">Address</span>
          </div>
          <div className="font-medium text-[8px] sm:text-[10px] md:text-[12px] text-slate-900 break-words">
            {data.address || "-"}
          </div>
        </div>

        {/* Date of Issue (left / bottom) */}
        <div
          className="absolute leading-tight"
          style={{ top: "87%", left: "14%" }}
        >
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-slate-700">
            วันออกบัตร
            <span className="ml-1 italic text-slate-600">Date of Issue</span>
          </div>
          <div className="font-semibold text-[8px] sm:text-[10px] md:text-[12px] text-slate-900">
            {formatThaiDate(issueDate)}
          </div>
          <div className="italic text-[7px] sm:text-[9px] md:text-[11px] text-slate-700">
            {formatEnDate(issueDate)}
          </div>
        </div>

        {/* Date of Expiry (right) */}
        <div
          className="absolute leading-tight text-right"
          style={{ top: "87%", right: "22%" }}
        >
          <div className="text-[6px] sm:text-[8px] md:text-[10px] text-slate-700">
            วันบัตรหมดอายุ
            <span className="ml-1 italic text-slate-600">Date of Expiry</span>
          </div>
          <div className="font-semibold text-[8px] sm:text-[10px] md:text-[12px] text-slate-900">
            {formatThaiDate(expiryDate)}
          </div>
          <div className="italic text-[7px] sm:text-[9px] md:text-[11px] text-slate-700">
            {formatEnDate(expiryDate)}
          </div>
        </div>

        {/* Signature placeholder */}
        <div
          className="absolute italic text-[7px] sm:text-[9px] md:text-[10px] text-slate-600"
          style={{ top: "78%", right: "22%" }}
        >
          (เจ้าพนักงานออกบัตร / Issuer)
        </div>
      </div>

      {/* Watermark overlay - "FOR TESTING ONLY" */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-col justify-around -rotate-[18deg] scale-125"
      >
        {watermarkRows.map((_, i) => (
          <div
            key={i}
            className="whitespace-nowrap text-center text-red-600/20 font-extrabold tracking-[0.35em] text-sm md:text-lg"
          >
            สำหรับทดสอบเท่านั้น • FOR TESTING ONLY • สำหรับทดสอบเท่านั้น
          </div>
        ))}
      </div>

      {/* Bottom disclaimer strip */}
      <div className="absolute bottom-1 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="text-[8px] md:text-[10px] font-bold text-red-700/90 uppercase tracking-wider">
          Sample / Not a Real ID
        </span>
        <span className="text-[8px] md:text-[10px] font-bold text-red-700/90">
          สำหรับทดสอบเท่านั้น
        </span>
      </div>
    </div>
  );
};

export default MockUpIdCard;
