import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem("theme") as Theme;
    return saved || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme") as Theme;
    if (saved === "dark") return "dark";
    if (saved === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes first
    root.classList.remove("light", "dark");

    let currentTheme: "light" | "dark";
    if (theme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      currentTheme = theme;
    }

    // Add the current theme class
    root.classList.add(currentTheme);
    setResolvedTheme(currentTheme);

    // Update CSS variables based on theme
    updateCSSVariables(currentTheme);
  }, [theme]);

  const updateCSSVariables = (currentTheme: "light" | "dark") => {
    const root = document.documentElement;

    if (currentTheme === "dark") {
      root.style.setProperty("--background", "15 23 42");
      root.style.setProperty("--foreground", "248 250 252");
      root.style.setProperty("--card", "30 41 59");
      root.style.setProperty("--card-foreground", "248 250 252");
      root.style.setProperty("--primary", "59 130 246");
      root.style.setProperty("--primary-foreground", "15 23 42");
      root.style.setProperty("--secondary", "30 41 59");
      root.style.setProperty("--secondary-foreground", "248 250 252");
      root.style.setProperty("--border", "51 65 85");
    } else {
      root.style.setProperty("--background", "255 255 255");
      root.style.setProperty("--foreground", "15 23 42");
      root.style.setProperty("--card", "255 255 255");
      root.style.setProperty("--card-foreground", "15 23 42");
      root.style.setProperty("--primary", "37 99 235");
      root.style.setProperty("--primary-foreground", "255 255 255");
      root.style.setProperty("--secondary", "241 245 249");
      root.style.setProperty("--secondary-foreground", "15 23 42");
      root.style.setProperty("--border", "226 232 240");
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        const resolved = mediaQuery.matches ? "dark" : "light";
        root.classList.add(resolved);
        setResolvedTheme(resolved);
        updateCSSVariables(resolved);
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
