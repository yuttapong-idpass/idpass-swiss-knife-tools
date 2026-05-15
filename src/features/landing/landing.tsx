import { Button } from "@/components/ui/button";
import { sidebarMenu } from "@/app/config/sidebar-menu";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/providers/ThemeProvider";
import Bee from "@/assets/images/bee.png";
import BeeFrutiger from "@/assets/images/bee-frutiger.png";

export default function LandingPage() {
  const { theme } = useTheme();
  const selectedTheme = theme === "system" ? "dark" : theme;
  const navigate = useNavigate();

  return (
    <main className="w-full p-4 md:p-6 min-h-screen bg-background">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl  text-primary-foreground">
              <img src={theme === "frutiger-aero" ? BeeFrutiger : Bee} alt="bee icon" className="size-16" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Buzz Tool
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Developer utilities in one place
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5">
          {sidebarMenu.map((section) => (
            <section
              key={section.id}
              className="rounded-2xl border bg-card shadow-sm p-4 md:p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-muted-foreground">{section.icon}</span>
                <h2 className="text-base md:text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                {section.menuLists.map((menu) => (
                  <Button
                    key={menu.name}
                    variant="outline"
                    className="h-auto min-h-12 py-3 px-3 justify-start gap-2 cursor-default"
                    onClick={() => navigate(menu.link)}
                  >
                    <span className="text-muted-foreground shrink-0">{menu.icon}</span>
                    <span className="text-left leading-tight">{menu.name}</span>
                  </Button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}