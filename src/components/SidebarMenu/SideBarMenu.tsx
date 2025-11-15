import * as React from "react";

export interface ISideBarMenuProps {
    children: React.ReactNode
}

export default function SideBarMenu({ children }: ISideBarMenuProps) {
  return <>{children}</>;
}
