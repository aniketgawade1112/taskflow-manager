import {
  Layout,
  Calendar,
  PieChart,
  BarChart3,
  Settings,
  Download,
} from "lucide-react";
import { Button } from "../common/Button";
import { ThemeToggle } from "../common/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { useAI } from "../../context/AIContext";
import { exportTasks, exportExpenses } from "../../utils/export";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasks: any[];
  expenses: any[];
}

export function Header({
  activeTab,
  setActiveTab,
  tasks,
  expenses,
}: HeaderProps) {
  const { resolvedTheme } = useTheme();
  const { settings } = useAI();

  const handleExport = () => {
    if (activeTab === "tasks" && tasks.length > 0) {
      exportTasks(tasks);
    } else if (activeTab === "expenses" && expenses.length > 0) {
      exportExpenses(expenses);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                resolvedTheme === "dark" ? "bg-primary-700" : "bg-primary-600"
              }`}
            >
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                TaskFlow Manager
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {settings.enabled
                  ? "AI-Powered Productivity Suite"
                  : "Organize tasks, track expenses"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {(tasks.length > 0 || expenses.length > 0) && (
              <Button
                variant="secondary"
                onClick={handleExport}
                className="flex items-center gap-2"
                title="Export data (Ctrl/Cmd + E)"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}

            <ThemeToggle />

            <Button
              variant="secondary"
              onClick={() =>
                document.dispatchEvent(new CustomEvent("open-settings"))
              }
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-1 pb-2 overflow-x-auto">
          <Button
            variant={activeTab === "dashboard" ? "primary" : "secondary"}
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>
          <Button
            variant={activeTab === "tasks" ? "primary" : "secondary"}
            onClick={() => setActiveTab("tasks")}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Tasks</span>
            {tasks.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
                {tasks.filter((t) => !t.completed).length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === "expenses" ? "primary" : "secondary"}
            onClick={() => setActiveTab("expenses")}
            className="flex items-center space-x-2"
          >
            <PieChart className="w-4 h-4" />
            <span>Expenses</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
