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
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  ChevronDown,
  FileBraces,
  FileCode,
  FileCodeCorner,
  FileCodeCornerIcon,
  KeyRound,
  Shuffle,
  Wrench,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export interface ISideBarMenuProps {
  children: React.ReactNode;
}

let menuList = [
  {
    id: 1,
    title: "Development",
    active: true,
    icon: <Wrench size={30} />,
    menuLists: [
      {
        name: "Json Pretty",
        active: true,
        link: "/json-pretty",
      },
      {
        name: "Differ",
        active: true,
        link: "/differ",
      },
      {
        name: "XML To Json",
        active: true,
        link: "/xml-to-json",
      },
      {
        name: "XML Pretty",
        active: true,
        link: "/xml-pretty",
      },
    ],
  },
  {
    id: 2,
    title: "Crypto",
    active: true,
    icon: <KeyRound size={30} />,
    menuLists: [
      {
        name: "JWT Parser",
        active: true,
        link: "/jwt",
      },
      {
        name: "Encode/Decoded",
        active: true,
        link: "/encoded-decoded",
      },
    ],
  },
  {
    id: 3,
    title: "Convertor",
    active: true,
    menuLists: [
      {
        name: "Base64 Image",
        // icon: <BsImage size={20} />,
        active: true,
        link: "/base64Image",
      },
    ],
  },
  {
    id: 4,
    title: "Generator",
    active: true,
    icon: <Shuffle size={30} />,
    menuLists: [
      {
        name: "Random Id Card",
        // icon: <BsPersonVcard size={20} />,
        link: "/id-card-random",
      },
      {
        name: "Barcode",
        // icon: <FaBarcode size={20} />,
        active: true,
        link: "/barcode",
      },
    ],
  },
];

export default function SideBarMenu() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuList.map((menu) => (
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem key={menu.title}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <span>{menu.title}</span> 
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu?.menuLists?.map((list) => (
                          <SidebarMenuSubItem>{list.name}</SidebarMenuSubItem>
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
    </Sidebar>
  );
}
