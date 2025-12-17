import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "./Button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Button
        variant={theme === "light" ? "primary" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="px-2"
      >
        <Sun className="w-4 h-4" />
      </Button>
      <Button
        variant={theme === "system" ? "primary" : "ghost"}
        size="sm"
        onClick={() => setTheme("system")}
        className="px-2"
      >
        <Monitor className="w-4 h-4" />
      </Button>
      <Button
        variant={theme === "dark" ? "primary" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="px-2"
      >
        <Moon className="w-4 h-4" />
      </Button>
    </div>
  );
}
