import {
  ArrowRightLeft,
  Barcode,
  Binary,
  Braces,
  Code2,
  FileSearch,
  GitCompareArrows,
  Globe,
  Home,
  Image,
  KeyRound,
  Lock,
  Settings2,
  Wrench,
  LockKeyhole,
} from "lucide-react";
import { NavigationSection } from "@/app/types/navigation";

export const sidebarMenu: NavigationSection[] = [
  {
    id: 0,
    title: "Landing",
    active: true,
    icon: <Home size={16} />,
    menuLists: [
      {
        name: "Home",
        active: true,
        link: "/",
        icon: <Home size={14} />,
      },
    ],
  },
  {
    id: 1,
    title: "Text & Format",
    active: true,
    icon: <Wrench size={16} />,
    menuLists: [
      {
        name: "JSON Formatter",
        active: true,
        link: "/json-formatter",
        icon: <Braces size={14} />,
      },
      {
        name: "Text Compare",
        active: true,
        link: "/text-compare",
        icon: <GitCompareArrows size={14} />,
      },
      {
        name: "XML To Json",
        active: true,
        link: "/xml-to-json",
        icon: <ArrowRightLeft size={14} />,
      },
      {
        name: "XML Formatter",
        active: true,
        link: "/xml-formatter",
        icon: <Code2 size={14} />,
      },
    ],
  },
  {
    id: 2,
    title: "Conversions & Encoding",
    active: true,
    icon: <KeyRound size={16} />,
    menuLists: [
      {
        name: "JWT Decoder",
        active: true,
        link: "/jwt-decoder",
        icon: <Lock size={14} />,
      },
      {
        name: "URL Encoder/Decoder",
        active: true,
        link: "/encoded-decoded-url",
        icon: <Globe size={14} />,
      },
      {
        name: "Base64 Converter",
        active: true,
        link: "/base64-encoder-decoder",
        icon: <Binary size={14} />,
      },
      {
        name: "Base64 Image",
        active: true,
        link: "/base64ToImage",
        icon: <Image size={14} />,
      },
      { 
        name: "Encrypt/Decrypt Text",
        active: true,
        link: "/encrypt-decrypt-text",
        icon: <LockKeyhole size={14} />,
      },
    ],
  },
  {
    id: 4,
    title: "Utilities",
    active: true,
    icon: <Settings2 size={16} />,
    menuLists: [
      {
        name: "Kibana Log Extractor",
        active: true,
        link: "/kibana-log-extractor",
        icon: <FileSearch size={14} />,
      },
      {
        name: "Bar Code Generator",
        active: true,
        link: "/barcode-generator",
        icon: <Barcode size={14} />,
      },
      {
        name: "JSON to Interface",
        active: true,
        link: "/json-to-interface",
        icon: <Code2 size={14} />,
      },
    ],
  },
];
