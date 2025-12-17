import React, { createContext, useContext, useState, ReactNode } from "react";

interface AISettings {
  enabled: boolean;
  privacyMode: boolean;
  taskParsing: boolean;
  expenseCategorization: boolean;
  suggestions: boolean;
  summaries: boolean;
}

interface AIContextType {
  settings: AISettings;
  updateSettings: (settings: Partial<AISettings>) => void;
  isAIAvailable: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const defaultSettings: AISettings = {
  enabled: true,
  privacyMode: true,
  taskParsing: true,
  expenseCategorization: true,
  suggestions: true,
  summaries: false,
};

export function AIProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    const saved = localStorage.getItem("ai-settings");
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<AISettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("ai-settings", JSON.stringify(updated));
  };

  const isAIAvailable = settings.enabled;

  return (
    <AIContext.Provider value={{ settings, updateSettings, isAIAvailable }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within AIProvider");
  }
  return context;
}
