import { useState } from "react";
import { X, Shield, Brain, Database } from "lucide-react";
import { Button } from "../common/Button";
import { Switch } from "../common/Switch";
import { Card } from "../common/Card";
import { useTheme } from "../../context/ThemeContext";
import { useAI } from "../../context/AIContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useAI();

  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      enabled: true,
      privacyMode: true,
      taskParsing: true,
      expenseCategorization: true,
      suggestions: true,
      summaries: false,
    };
    setLocalSettings(defaultSettings);
    updateSettings(defaultSettings);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
          <div className="px-6 py-4 border-b dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Settings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize your TaskFlow Manager experience
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Theme Settings */}
              <Card title="Theme" subtitle="Choose your preferred theme">
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "primary" : "secondary"}
                    onClick={() => setTheme("light")}
                    className="flex-1"
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === "system" ? "primary" : "secondary"}
                    onClick={() => setTheme("system")}
                    className="flex-1"
                  >
                    System
                  </Button>
                  <Button
                    variant={theme === "dark" ? "primary" : "secondary"}
                    onClick={() => setTheme("dark")}
                    className="flex-1"
                  >
                    Dark
                  </Button>
                </div>
              </Card>

              {/* AI Settings */}
              <Card title="AI Assistant" subtitle="Configure AI features">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <div>
                        <p className="font-medium">Enable AI Assistant</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Use AI to enhance task and expense management
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={localSettings.enabled}
                      onCheckedChange={(checked) =>
                        setLocalSettings({ ...localSettings, enabled: checked })
                      }
                    />
                  </div>

                  {localSettings.enabled && (
                    <>
                      <div className="space-y-3 pl-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Privacy Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Redact sensitive data before AI processing
                            </p>
                          </div>
                          <Switch
                            checked={localSettings.privacyMode}
                            onCheckedChange={(checked) =>
                              setLocalSettings({
                                ...localSettings,
                                privacyMode: checked,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Smart Task Parsing</span>
                            <Switch
                              checked={localSettings.taskParsing}
                              onCheckedChange={(checked) =>
                                setLocalSettings({
                                  ...localSettings,
                                  taskParsing: checked,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Expense Auto-Categorization</span>
                            <Switch
                              checked={localSettings.expenseCategorization}
                              onCheckedChange={(checked) =>
                                setLocalSettings({
                                  ...localSettings,
                                  expenseCategorization: checked,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>AI Suggestions</span>
                            <Switch
                              checked={localSettings.suggestions}
                              onCheckedChange={(checked) =>
                                setLocalSettings({
                                  ...localSettings,
                                  suggestions: checked,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Weekly Summaries</span>
                            <Switch
                              checked={localSettings.summaries}
                              onCheckedChange={(checked) =>
                                setLocalSettings({
                                  ...localSettings,
                                  summaries: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {localSettings.privacyMode && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Privacy Protection Active
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                Sensitive data like amounts and personal details
                                are redacted before being sent to AI services.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>

              {/* Data Management */}
              <Card title="Data Management" subtitle="Manage your data">
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    className="justify-start"
                    onClick={() => {
                      const event = new CustomEvent("trigger-export");
                      document.dispatchEvent(event);
                      onClose();
                    }}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reset AI Settings
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Reset all AI settings to default
                    </p>
                    <Button variant="secondary" size="sm" onClick={handleReset}>
                      Reset to Defaults
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="px-6 py-4 border-t dark:border-gray-800 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
