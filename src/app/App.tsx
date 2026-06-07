import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideBarMenu from "@/components/SidebarMenu/SideBarMenu";
import AppRoutes from "@/app/routes";
import FrutigerAquaBackground from "@/components/FrutigerAquaBackground/FrutigerAquaBackground";

export default function App() {
  return (
    <div className="flex flex-row dark:bg-dark-bg">
      {/* z-index 0 — seaweed + bubbles sit behind the editor */}
      <FrutigerAquaBackground />
      {/* z-index 1 — all UI sits above the background layer */}
      <div className="relative z-[1] flex flex-row w-full">
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
