import { useState, useEffect } from "react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { useAI } from "../../context/AIContext";
import { AIService } from "../../utils/ai";

interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
  initialData?: any;
  categories: string[];
}

export function ExpenseForm({
  onSubmit,
  initialData,
  categories,
}: ExpenseFormProps) {
  const { settings } = useAI();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    amount: initialData?.amount?.toString() || "",
    category: initialData?.category || categories[0],
    type: initialData?.type || "expense",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    description: initialData?.description || "",
    tags: initialData?.tags?.join(", ") || "",
  });

  const [aiSuggestions, setAiSuggestions] = useState<{
    category?: string;
    confidence?: number;
  }>({});

  // Auto-detect category when title changes
  useEffect(() => {
    if (
      settings.expenseCategorization &&
      formData.title.trim() &&
      !initialData
    ) {
      const delayDebounce = setTimeout(async () => {
        try {
          const amount = parseFloat(formData.amount) || 0;
          const response = await AIService.categorizeExpenseWithAI(
            formData.title,
            amount
          );

          if (response.confidence > 0.6) {
            setAiSuggestions({
              category: response.result.category,
              confidence: response.confidence,
            });

            // Auto-apply if confidence is high
            if (
              response.confidence > 0.8 &&
              categories.includes(response.result.category)
            ) {
              setFormData((prev) => ({
                ...prev,
                category: response.result.category,
              }));
            }
          }
        } catch (error) {
          console.error("AI categorization failed:", error);
        }
      }, 1000);

      return () => clearTimeout(delayDebounce);
    }
  }, [
    formData.title,
    formData.amount,
    settings.expenseCategorization,
    categories,
    initialData,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount) return;

    onSubmit({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: new Date(formData.date),
      description: formData.description || undefined,
      tags: formData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean),
      aiSuggestedCategory: aiSuggestions.category,
      aiConfidence: aiSuggestions.confidence,
    });

    if (!initialData) {
      setFormData({
        title: "",
        amount: "",
        category: categories[0],
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        description: "",
        tags: "",
      });
      setAiSuggestions({});
    }
  };

  const applyAISuggestion = () => {
    if (aiSuggestions.category && categories.includes(aiSuggestions.category)) {
      setFormData((prev) => ({
        ...prev,
        category: aiSuggestions.category!,
      }));
      setAiSuggestions({});
    }
  };

  return (
    <Card
      title={initialData ? "Edit Transaction" : "Add Transaction"}
      subtitle={initialData ? "" : "AI will suggest categories as you type"}
      className="h-fit"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-colors duration-200"
              placeholder="Lunch with client at Cafe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full pl-8 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                           border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-colors duration-200"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {aiSuggestions.category && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  AI Suggestion
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Category:{" "}
                  <span className="font-semibold">
                    {aiSuggestions.category}
                  </span>
                  <span className="ml-2 text-xs">
                    (Confidence:{" "}
                    {Math.round((aiSuggestions.confidence || 0) * 100)}%)
                  </span>
                </p>
              </div>
              <Button
                type="button"
                onClick={applyAISuggestion}
                variant="secondary"
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-colors duration-200"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
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
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-colors duration-200"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
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
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                       border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-colors duration-200"
            placeholder="client, business, travel"
          />
        </div>

        <Button
          type="submit"
          variant={formData.type === "income" ? "success" : "primary"}
          fullWidth
          className="py-3"
        >
          {initialData ? "Update Transaction" : "Add Transaction"}
        </Button>
      </form>
    </Card>
  );
}
