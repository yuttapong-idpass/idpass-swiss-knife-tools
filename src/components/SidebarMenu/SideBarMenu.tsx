import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";
import {
  ArrowRightLeft,
  Barcode,
  Binary,
  Braces,
  ChevronUp,
  Code2,
  FileSearch,
  GitCompareArrows,
  Globe,
  Image,
  KeyRound,
  Lock,
  Settings2,
  Shuffle,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Link } from "react-router-dom";

export interface ISideBarMenuProps {
  children: React.ReactNode;
}

let menuList = [
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
    ],
  },
  // {
  //   id: 3,
  //   title: "Generators",
  //   active: true,
  //   icon: <Shuffle size={16} />,
  //   menuLists: [
  //     {
  //       name: "Random Id Card",
  //       link: "/id-card-random",
  //       icon: <Shuffle size={14} />,
  //     },
  //     {
  //       name: "Barcode",
  //       active: true,
  //       link: "/barcode",
  //       icon: <Shuffle size={14} />,
  //     },
  //   ],
  // },
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
      }
      // {
      //   name: "Mock Up ID Card",
      //   active: true,
      //   link: "/mock-up-id-card",
      //   icon: <Settings2 size={14} />,
      // },
    ],
  },
];

export default function SideBarMenu() {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex flex-col gap-1 leading-none">
                  <span className="font-semibold">Buzz Tool</span>
                  <span className="text-xs text-muted-foreground">
                    tools for developer
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuList.map((menu) => (
                <Collapsible
                  defaultOpen
                  className="group/collapsible"
                  key={menu.id}
                >
                  <SidebarMenuItem key={menu.title}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {menu.icon && (
                          <span className="text-muted-foreground">
                            {menu.icon}
                          </span>
                        )}
                        <span>{menu.title}</span>
                        <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.menuLists.map((list: any, idx: number) => (
                          <SidebarMenuSubItem key={list.name}>
                            <SidebarMenuSubButton asChild>
                              <Link to={list.link} key={idx} className="flex items-center gap-2">
                                {list.icon && (
                                  <span className="text-muted-foreground shrink-0">
                                    {list.icon}
                                  </span>
                                )}
                                {list.name}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>xxx</SidebarFooter>
    </Sidebar>
  );
}
