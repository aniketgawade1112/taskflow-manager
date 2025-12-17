import { useState, useEffect } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { useAI } from "../../context/AIContext";
import { AIService } from "../../utils/ai";

interface TodoFormProps {
  onSubmit: (todo: any) => void;
  initialData?: any;
  categories: string[];
}

export function TodoForm({ onSubmit, initialData, categories }: TodoFormProps) {
  const { settings } = useAI();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    category: initialData?.category || categories[0],
    dueDate: initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : "",
  });

  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    priority?: string;
    estimatedHours?: number;
    dueDate?: string;
  }>({});

  // Auto-parse task when title changes (if AI is enabled)
  useEffect(() => {
    if (settings.taskParsing && formData.title.trim() && !initialData) {
      const delayDebounce = setTimeout(async () => {
        try {
          const response = await AIService.parseTaskWithAI(formData.title);

          if (response.confidence > 0.6) {
            setAiSuggestions({
              priority: response.result.priority,
              estimatedHours: response.result.estimatedHours,
              dueDate: response.result.dueDate,
            });

            // Auto-apply priority if confidence is high
            if (response.confidence > 0.8 && response.result.priority) {
              setFormData((prev) => ({
                ...prev,
                priority: response.result.priority.toLowerCase(),
              }));
            }
          }
        } catch (error) {
          console.error("AI parsing failed:", error);
        }
      }, 1500);

      return () => clearTimeout(delayDebounce);
    }
  }, [formData.title, settings.taskParsing, initialData]);

  const handleAIAssist = async () => {
    if (!formData.title.trim() || !settings.taskParsing) return;

    setIsAIProcessing(true);
    try {
      const response = await AIService.parseTaskWithAI(formData.title);

      if (response.confidence > 0.7) {
        setFormData((prev) => ({
          ...prev,
          priority: response.result.priority.toLowerCase(),
          dueDate: response.result.dueDate || prev.dueDate,
        }));

        setAiSuggestions({
          priority: response.result.priority,
          estimatedHours: response.result.estimatedHours,
          dueDate: response.result.dueDate,
        });
      }
    } catch (error) {
      console.error("AI assist failed:", error);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const todoData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      completed: initialData?.completed || false,
      estimatedHours: aiSuggestions.estimatedHours,
      aiEnhanced: settings.taskParsing && formData.title.trim().length > 10,
    };

    onSubmit(todoData);

    if (!initialData) {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: categories[0],
        dueDate: "",
      });
      setAiSuggestions({});
    }
  };

  const applyAISuggestion = (field: "priority" | "dueDate") => {
    if (field === "priority" && aiSuggestions.priority) {
      setFormData((prev) => ({
        ...prev,
        priority: aiSuggestions.priority!.toLowerCase(),
      }));
    } else if (field === "dueDate" && aiSuggestions.dueDate) {
      setFormData((prev) => ({
        ...prev,
        dueDate: aiSuggestions.dueDate || "",
      }));
    }
    setAiSuggestions((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <Card
      title={initialData ? "Edit Task" : "Add New Task"}
      subtitle={
        initialData ? "" : "AI will suggest priority and dates as you type"
      }
      className="h-fit"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="flex-1 px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-colors duration-200"
              placeholder="What needs to be done?"
              required
            />
            {settings.taskParsing && (
              <Button
                type="button"
                onClick={handleAIAssist}
                disabled={isAIProcessing || !formData.title.trim()}
                variant="secondary"
                className="whitespace-nowrap min-w-[100px]"
                title="Enhance with AI"
              >
                {isAIProcessing ? (
                  <Wand2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">Enhance</span>
              </Button>
            )}
          </div>
        </div>

        {aiSuggestions.priority && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  AI Suggestion
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Priority:{" "}
                  <span className="font-semibold capitalize">
                    {aiSuggestions.priority}
                  </span>
                  {aiSuggestions.estimatedHours && (
                    <span className="ml-4">
                      Est:{" "}
                      <span className="font-semibold">
                        {aiSuggestions.estimatedHours}h
                      </span>
                    </span>
                  )}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => applyAISuggestion("priority")}
                variant="secondary"
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                       border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-colors duration-200"
            placeholder="Additional details..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-colors duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-colors duration-200"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-colors duration-200"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth className="py-3">
          {initialData ? "Update Task" : "Add Task"}
        </Button>

        {settings.taskParsing && !initialData && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Tip
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Try describing your goal. Example: "Prepare quarterly report
                  by Friday"
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
