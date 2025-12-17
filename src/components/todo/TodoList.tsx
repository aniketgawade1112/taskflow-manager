import { useState } from "react";
import { format } from "date-fns";
import { Check, Clock, AlertCircle, Trash2, Edit2 } from "lucide-react";
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
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
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
        <div className="flex space-x-2 mb-4">
          {(["all", "active", "completed"] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "primary" : "secondary"}
              size="sm"
              onClick={() => setFilter(filterType)}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>

        {/* Todo List */}
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-secondary-500">
            No tasks found. Add a new task to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`
                  flex items-center justify-between p-4 rounded-lg border
                  ${
                    todo.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-secondary-200"
                  }
                  hover:bg-secondary-50 transition-colors
                `}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onToggle(todo.id)}
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-secondary-300 hover:border-primary-500"
                      }
                    `}
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </button>

                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        todo.completed
                          ? "line-through text-secondary-500"
                          : "text-secondary-900"
                      }`}
                    >
                      {todo.title}
                    </h4>
                    {todo.description && (
                      <p className="text-sm text-secondary-600 mt-1">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-3 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {getPriorityIcon(todo.priority)}
                        <span>{todo.priority}</span>
                      </span>
                      <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
                        {todo.category}
                      </span>
                      {todo.dueDate && (
                        <span className="text-xs text-secondary-500">
                          Due: {format(new Date(todo.dueDate), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(todo)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(todo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
