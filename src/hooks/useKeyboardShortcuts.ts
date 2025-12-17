import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export function useKeyboardShortcuts() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if input is focused
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Quick add task (Ctrl/Cmd + K)
      if (modKey && e.key === "k") {
        e.preventDefault();
        const event = new CustomEvent("open-quick-add");
        document.dispatchEvent(event);
      }

      // Toggle dark mode (Ctrl/Cmd + Shift + D)
      if (modKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        const currentTheme = localStorage.getItem("theme") || "system";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
      }

      // Search (Ctrl/Cmd + /)
      if (modKey && e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector(
          "[data-search-input]"
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape to close modals
      if (e.key === "Escape") {
        const event = new CustomEvent("close-all-modals");
        document.dispatchEvent(event);
      }

      // Export data (Ctrl/Cmd + E)
      if (modKey && e.key === "e") {
        e.preventDefault();
        const event = new CustomEvent("trigger-export");
        document.dispatchEvent(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTheme]);
}
