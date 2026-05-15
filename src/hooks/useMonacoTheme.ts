import { useTheme } from "@/providers/ThemeProvider";

export function useMonacoTheme() {
  const { theme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return isDark ? "vs-dark" : "vs-light";
}
