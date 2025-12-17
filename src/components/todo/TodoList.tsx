import { useState } from "react";
import { format } from "date-fns";
import {
  Check,
  Clock,
  AlertCircle,
  Trash2,
  Edit2,
  Sparkles,
} from "lucide-react";
import { Todo } from "../../types";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const getPriorityColor = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    }
  };

  const getPriorityIcon = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4" />;
      case "medium":
        return <Clock className="w-4 h-4" />;
      case "low":
        return <Check className="w-4 h-4" />;
    }
  };

  return (
    <Card title="Daily Tasks" subtitle={`${todos.length} tasks total`}>
      <div className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["all", "active", "completed"] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "primary" : "secondary"}
              size="sm"
              onClick={() => setFilter(filterType)}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === "active" &&
                todos.filter((t) => !t.completed).length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
                    {todos.filter((t) => !t.completed).length}
                  </span>
                )}
            </Button>
          ))}
        </div>

        {/* Todo List */}
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              {filter === "completed" ? (
                <Check className="w-12 h-12 mx-auto" />
              ) : filter === "active" ? (
                <Clock className="w-12 h-12 mx-auto" />
              ) : (
                <Sparkles className="w-12 h-12 mx-auto" />
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === "completed"
                ? "No completed tasks yet. Complete some tasks!"
                : filter === "active"
                ? "No pending tasks. Great job!"
                : "No tasks found. Add a new task to get started!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`
                  flex items-center justify-between p-4 rounded-lg border
                  transition-all duration-200
                  ${
                    todo.completed
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }
                  hover:bg-gray-50 dark:hover:bg-gray-700/50
                `}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => onToggle(todo.id)}
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      transition-colors duration-200 flex-shrink-0 mt-1
                      ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400"
                      }
                    `}
                    aria-label={
                      todo.completed ? "Mark as incomplete" : "Mark as complete"
                    }
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4
                        className={`
                        font-medium break-words
                        ${
                          todo.completed
                            ? "line-through text-gray-500 dark:text-gray-500"
                            : "text-gray-900 dark:text-gray-100"
                        }
                      `}
                      >
                        {todo.title}
                        {todo.aiEnhanced && (
                          <span className="ml-2 inline-flex items-center text-xs text-primary-600 dark:text-primary-400">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </span>
                        )}
                      </h4>
                      <div className="flex space-x-2 ml-2 flex-shrink-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(todo)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDelete(todo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {todo.description && (
                      <p
                        className={`text-sm mt-1 ${
                          todo.completed
                            ? "text-gray-500"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {getPriorityIcon(todo.priority)}
                        <span className="capitalize">{todo.priority}</span>
                      </span>

                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        {todo.category}
                      </span>

                      {todo.dueDate && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            new Date(todo.dueDate) < new Date() &&
                            !todo.completed
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Due: {format(new Date(todo.dueDate), "MMM d")}
                        </span>
                      )}

                      {todo.estimatedHours && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                          Est: {todo.estimatedHours}h
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {todos.length > 0 && (
          <div className="pt-4 border-t dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>
                  {todos.filter((t) => t.completed).length} of {todos.length}{" "}
                  completed
                </span>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <span>
                  {todos.filter((t) => t.aiEnhanced).length} AI-enhanced tasks
                </span>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  {Math.round(
                    (todos.filter((t) => t.completed).length / todos.length) *
                      100
                  )}
                  % complete
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
