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
import { ChevronUp, KeyRound, Shuffle, Sparkles, Wrench } from "lucide-react";
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
    icon: <Wrench size={30} />,
    menuLists: [
      {
        name: "JSON Formatter",
        active: true,
        link: "/json-formatter",
      },
      {
        name: "Text Compare",
        active: true,
        link: "/text-compare",
      },
      {
        name: "XML To Json",
        active: true,
        link: "/xml-to-json",
      },
      {
        name: "XML Formatter",
        active: true,
        link: "/xml-formatter",
      },
    ],
  },
  {
    id: 2,
    title: "Conversions & Encoding",
    active: true,
    icon: <KeyRound size={30} />,
    menuLists: [
      {
        name: "JWT Decoder",
        active: true,
        link: "/jwt-decoder",
      },
      {
        name: "Encode/Decoded URL",
        active: true,
        link: "/encoded-decoded-url",
      },
      {
        name: "Base64 To Image",
        active: true,
        link: "/base64ToImage",
      },
    ],
  },
  // {
  //   id: 3,
  //   title: "Generators",
  //   active: true,
  //   icon: <Shuffle size={30} />,
  //   menuLists: [
  //     {
  //       name: "Random Id Card",
  //       link: "/id-card-random",
  //     },
  //     {
  //       name: "Barcode",
  //       active: true,
  //       link: "/barcode",
  //     },
  //   ],
  // },
  {
    id: 4,
    title: "Utilities",
    active: true,
    menuLists: [
      {
        name: "Kibana Log Extractor",
        active: true,
        link: "/kibana-log-extractor",
      },
      // {
      //   name: "Mock Up ID Card",
      //   active: true,
      //   link: "/mock-up-id-card",
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
                        <span>{menu.title}</span>
                        <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.menuLists.map((list: any, idx: number) => (
                          <SidebarMenuSubItem key={list.name}>
                            <SidebarMenuSubButton asChild>
                              <Link to={list.link} key={idx}>
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
