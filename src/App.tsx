import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ThemeProvider } from "./context/ThemeContext";
import { AIProvider } from "./context/AIContext";
import { Header } from "./components/layout/Header";
import { SettingsModal } from "./components/layout/SettingsModal";
import { TodoList } from "./components/todo/TodoList";
import { TodoForm } from "./components/todo/TodoForm";
import { TaskInputWithAI } from "./components/todo/TaskInputWithAI";
import { ExpenseList } from "./components/expense/ExpenseList";
import { ExpenseForm } from "./components/expense/ExpenseForm";
import { DashboardStats } from "./components/dashboard/DashboardStats";
import { AISuggestions } from "./components/dashboard/AISuggestions";
import { TaskSkeleton, ExpenseSkeleton } from "./components/common/Skeleton";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { exportTasks, exportExpenses } from "./utils/export";
import { Todo, Expense } from "./types";
import "./styles/globals.css";

function AppContent() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "tasks" | "expenses"
  >("dashboard");
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved
      ? JSON.parse(saved).map((t: any) => ({
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          createdAt: new Date(t.createdAt),
        }))
      : [];
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("expenses");
    return saved
      ? JSON.parse(saved).map((e: any) => ({
          ...e,
          date: new Date(e.date),
        }))
      : [];
  });
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "Work",
    "Personal",
    "Shopping",
    "Health",
    "Education",
    "Travel",
    "Meals",
    "Software",
    "Office",
  ];

  useKeyboardShortcuts();

  // Load data with skeleton simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Event listeners
  useEffect(() => {
    const handleOpenQuickAdd = () => {
      setActiveTab("tasks");
      const input = document.querySelector(
        "[data-search-input]"
      ) as HTMLInputElement;
      setTimeout(() => input?.focus(), 100);
    };

    const handleCloseModals = () => {
      setEditingTodo(undefined);
      setEditingExpense(undefined);
    };

    const handleTriggerExport = () => {
      if (activeTab === "tasks" && todos.length > 0) {
        exportTasks(todos);
      } else if (activeTab === "expenses" && expenses.length > 0) {
        exportExpenses(expenses);
      }
    };

    const handleOpenSettings = () => setIsSettingsOpen(true);

    document.addEventListener("open-quick-add", handleOpenQuickAdd);
    document.addEventListener("close-all-modals", handleCloseModals);
    document.addEventListener("trigger-export", handleTriggerExport);
    document.addEventListener("open-settings", handleOpenSettings);

    return () => {
      document.removeEventListener("open-quick-add", handleOpenQuickAdd);
      document.removeEventListener("close-all-modals", handleCloseModals);
      document.removeEventListener("trigger-export", handleTriggerExport);
      document.removeEventListener("open-settings", handleOpenSettings);
    };
  }, [activeTab, todos, expenses]);

  // Calculate stats
  const stats = {
    totalTodos: todos.length,
    completedTodos: todos.filter((t) => t.completed).length,
    pendingTodos: todos.filter((t) => !t.completed).length,
    totalExpenses: expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0),
    totalIncome: expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0),
    balance:
      expenses
        .filter((e) => e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0) -
      expenses
        .filter((e) => e.type === "expense")
        .reduce((sum, e) => sum + e.amount, 0),
    productivityScore:
      todos.length > 0
        ? Math.round(
            (todos.filter((t) => t.completed).length / todos.length) * 100
          )
        : 0,
  };

  // Todo handlers
  const handleAddTodo = (todoData: any) => {
    const newTodo: Todo = {
      ...todoData,
      id: uuidv4(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
    setEditingTodo(undefined);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    setEditingTodo(undefined);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // Expense handlers
  const handleAddExpense = (expenseData: any) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4(),
    };
    setExpenses([newExpense, ...expenses]);
    setEditingExpense(undefined);
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(
      expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
    );
    setEditingExpense(undefined);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Recent expenses for dashboard
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentTodos = [...todos]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        tasks={todos}
        expenses={expenses}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <TaskSkeleton key={i} />
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <ExpenseSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <>
                <DashboardStats stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Tasks
                      </h2>
                      {recentTodos.length > 0 ? (
                        <TodoList
                          todos={recentTodos}
                          onToggle={handleToggleTodo}
                          onDelete={handleDeleteTodo}
                          onEdit={setEditingTodo}
                        />
                      ) : (
                        <div className="text-center py-12 border rounded-lg dark:border-gray-700">
                          <p className="text-gray-500 dark:text-gray-400">
                            No tasks yet. Add your first task!
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Transactions
                      </h2>
                      {recentExpenses.length > 0 ? (
                        <ExpenseList
                          expenses={recentExpenses}
                          onDelete={handleDeleteExpense}
                          onEdit={setEditingExpense}
                        />
                      ) : (
                        <div className="text-center py-12 border rounded-lg dark:border-gray-700">
                          <p className="text-gray-500 dark:text-gray-400">
                            No transactions yet. Add your first expense!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <AISuggestions tasks={todos} expenses={expenses} />

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setActiveTab("tasks")}
                          className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
                        >
                          <p className="font-medium text-gray-900 dark:text-white">
                            Add New Task
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Create a new task or goal
                          </p>
                        </button>
                        <button
                          onClick={() => setActiveTab("expenses")}
                          className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
                        >
                          <p className="font-medium text-gray-900 dark:text-white">
                            Add Expense
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Track an expense or income
                          </p>
                        </button>
                        <button
                          onClick={() => setIsSettingsOpen(true)}
                          className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
                        >
                          <p className="font-medium text-gray-900 dark:text-white">
                            AI Settings
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Configure AI features and privacy
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "tasks" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <TaskInputWithAI onTaskCreate={handleAddTodo} />
                  </div>

                  {todos.length > 0 ? (
                    <TodoList
                      todos={todos}
                      onToggle={handleToggleTodo}
                      onDelete={handleDeleteTodo}
                      onEdit={setEditingTodo}
                    />
                  ) : (
                    <div className="text-center py-12 border rounded-lg dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No tasks yet. Add your first task above!
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  {(editingTodo || todos.length === 0) && (
                    <TodoForm
                      onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
                      initialData={editingTodo}
                      categories={categories}
                    />
                  )}

                  {!editingTodo && todos.length > 0 && (
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200 mb-2">
                        AI-Powered Productivity
                      </h3>
                      <p className="text-sm text-primary-700 dark:text-primary-300 mb-4">
                        Use natural language to create tasks. Try describing
                        your goals and let AI help structure them.
                      </p>
                      <ul className="space-y-2 text-sm text-primary-600 dark:text-primary-400">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>"Prepare quarterly report by Friday"</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            "Research competitors and create presentation"
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            "Schedule team meeting for project kickoff"
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "expenses" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {expenses.length > 0 ? (
                    <ExpenseList
                      expenses={expenses}
                      onDelete={handleDeleteExpense}
                      onEdit={setEditingExpense}
                    />
                  ) : (
                    <div className="text-center py-12 border rounded-lg dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No transactions yet. Add your first expense!
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <ExpenseForm
                    onSubmit={
                      editingExpense ? handleUpdateExpense : handleAddExpense
                    }
                    initialData={editingExpense}
                    categories={categories}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>
              TaskFlow Manager © {new Date().getFullYear()} - AI-Powered
              Productivity Suite
            </p>
            <p className="mt-1">
              Press{" "}
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border">
                Ctrl/Cmd
              </kbd>{" "}
              +{" "}
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border mx-1">
                K
              </kbd>{" "}
              to quickly add tasks
            </p>
          </div>
        </div>
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AIProvider>
        <AppContent />
      </AIProvider>
    </ThemeProvider>
  );
}
