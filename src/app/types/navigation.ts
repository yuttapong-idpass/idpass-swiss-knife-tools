import React from "react";

export interface NavigationItem {
  name: string;
  link: string;
  active?: boolean;
  icon?: React.ReactNode;
}

export interface NavigationSection {
  id: number;
  title: string;
  active?: boolean;
  icon?: React.ReactNode;
  menuLists: NavigationItem[];
}
