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
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import { ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Link } from "react-router-dom";
import { sidebarMenu } from "@/app/config/sidebar-menu";
import { NavigationItem } from "@/app/types/navigation";
import { Theme, useTheme } from "@/providers/ThemeProvider";
import Bee from "@/assets/images/bee.png";
import BeeFrutiger from "@/assets/images/bee-frutiger.png";

const APP_VERSION = `v${__APP_VERSION__}`;

export default function SideBarMenu() {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const selectedTheme = theme === "system" ? "dark" : theme;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between">
              <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                  <div className="flex aspect-square size-14 items-center justify-center rounded-lg text-primary-foreground">
                    <img
                      src={theme === "nature" || theme === "frutiger-aero" ? BeeFrutiger : Bee}
                      alt="bee icon"
                      className="size-12"
                    />
                  </div>
                  <div className="flex flex-col gap-1 leading-none">
                    <span className="font-semibold">Buzz Tool</span>
                    <span className="text-xs text-muted-foreground">
                      tools for developer
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
              <SidebarTrigger />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenu.map((menu) => (
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
                        {menu.menuLists.map((list: NavigationItem) => (
                          <SidebarMenuSubItem key={list.name}>
                            <SidebarMenuSubButton asChild>
                              <Link to={list.link} className="flex items-center gap-2">
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
      {state === "expanded" && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <p className="px-1 pb-1 text-xs text-muted-foreground whitespace-nowrap">
                {APP_VERSION}
              </p>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground whitespace-nowrap">Theme</p>
                <Select
                  value={selectedTheme}
                  onValueChange={(value) => setTheme(value as Theme)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="frutiger-aero">Frutiger Aero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
