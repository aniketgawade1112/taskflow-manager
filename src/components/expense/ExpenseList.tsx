// src/components/expense/ExpenseList.tsx
import { format } from "date-fns";
import { Trash2, Edit2, TrendingUp, TrendingDown } from "lucide-react";
import { Expense } from "../../types";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card
      title="Recent Transactions"
      subtitle={`${expenses.length} transactions`}
    >
      {expenses.length === 0 ? (
        <div className="text-center py-8 text-secondary-500">
          No transactions found. Add your first transaction!
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    expense.type === "income"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }
                `}
                >
                  {expense.type === "income" ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-secondary-900">
                      {expense.title}
                    </h4>
                    <span
                      className={`
                      font-semibold
                      ${
                        expense.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    `}
                    >
                      {expense.type === "income" ? "+" : "-"}
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-secondary-500">
                      {format(new Date(expense.date), "MMM d, yyyy")}
                    </span>
                    <span className="text-sm text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
                      {expense.category}
                    </span>
                    {expense.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {expense.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {expense.tags.length > 2 && (
                          <span className="text-xs text-secondary-500">
                            +{expense.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {expense.description && (
                    <p className="text-sm text-secondary-600 mt-2">
                      {expense.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(expense)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
