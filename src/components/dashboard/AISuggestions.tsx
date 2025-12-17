import { Sparkles, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { useAI } from "../../context/AIContext";

interface AISuggestionsProps {
  tasks: any[];
  expenses: any[];
}

export function AISuggestions({ tasks, expenses }: AISuggestionsProps) {
  const { settings } = useAI();

  if (!settings.suggestions) return null;

  const pendingTasks = tasks.filter((t) => !t.completed);
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === "high");
  const today = new Date();
  const overdueTasks = pendingTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < today
  );

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalExpenses = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const suggestions = [];

  // Task-based suggestions
  if (overdueTasks.length > 0) {
    suggestions.push({
      type: "warning",
      icon: AlertTriangle,
      title: `${overdueTasks.length} overdue tasks`,
      message: "Consider rescheduling or delegating these tasks.",
      action: "Review overdue tasks",
    });
  }

  if (highPriorityTasks.length > 0) {
    suggestions.push({
      type: "priority",
      icon: TrendingUp,
      title: `${highPriorityTasks.length} high priority tasks`,
      message: "Focus on these tasks first for maximum impact.",
      action: "View high priority",
    });
  }

  // Expense-based suggestions
  if (recentExpenses.length > 0) {
    const avgExpense =
      totalExpenses / expenses.filter((e) => e.type === "expense").length || 0;
    const largeExpenses = recentExpenses.filter(
      (e) => e.amount > avgExpense * 2
    );

    if (largeExpenses.length > 0) {
      suggestions.push({
        type: "finance",
        icon: Lightbulb,
        title: "Large expenses detected",
        message: `You have ${largeExpenses.length} expenses significantly above average.`,
        action: "Review expenses",
      });
    }
  }

  if (suggestions.length === 0 && pendingTasks.length > 0) {
    suggestions.push({
      type: "general",
      icon: Sparkles,
      title: "Productivity tip",
      message: "Try breaking down large tasks into smaller, actionable steps.",
      action: "Learn more",
    });
  }

  return (
    <Card title="AI Suggestions" subtitle="Personalized recommendations">
      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Add more tasks and expenses to get AI suggestions.
            </p>
          </div>
        ) : (
          suggestions.slice(0, 3).map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  suggestion.type === "warning"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                    : suggestion.type === "priority"
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      suggestion.type === "warning"
                        ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300"
                        : suggestion.type === "priority"
                        ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {suggestion.message}
                    </p>
                    <Button variant="secondary" size="sm" className="mt-3">
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
