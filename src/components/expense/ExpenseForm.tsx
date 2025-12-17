import { useState } from "react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Expense } from "../../types";

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id">) => void;
  initialData?: Partial<Expense>;
  categories: string[];
}

export function ExpenseForm({
  onSubmit,
  initialData,
  categories,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    amount: initialData?.amount?.toString() || "",
    category: initialData?.category || categories[0],
    type: initialData?.type || ("expense" as Expense["type"]),
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    description: initialData?.description || "",
    tags: initialData?.tags?.join(", ") || "",
  });

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
        .map((tag) => tag.trim())
        .filter(Boolean),
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
    }
  };

  return (
    <Card title={initialData ? "Edit Transaction" : "Add Transaction"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter transaction title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-secondary-500">
                $
              </span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full pl-8 pr-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as Expense["type"],
                })
              }
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Additional notes..."
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="food, groceries, transport"
          />
        </div>

        <Button
          type="submit"
          variant={formData.type === "income" ? "success" : "primary"}
          fullWidth
        >
          {initialData ? "Update Transaction" : "Add Transaction"}
        </Button>
      </form>
    </Card>
  );
}
