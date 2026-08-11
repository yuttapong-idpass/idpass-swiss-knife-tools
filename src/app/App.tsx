import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideBarMenu from "@/components/SidebarMenu/SideBarMenu";
import AppRoutes from "@/app/routes";

export default function App() {
  return (
    <div className="flex flex-row dark:bg-dark-bg">
      <div className="flex flex-row w-full">
        <BrowserRouter>
          <SidebarProvider>
            <SideBarMenu />
            <AppRoutes />
          </SidebarProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}
