// src/App.tsx
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Layout, Calendar, PieChart, BarChart3 } from "lucide-react";
import { AppProvider, useAppContext } from "./context/AppContext";
import { TodoForm } from "./components/todo/TodoForm";
import { TodoList } from "./components/todo/TodoList";
import { ExpenseForm } from "./components/expense/ExpenseForm";
import { ExpenseList } from "./components/expense/ExpenseList";
import { DashboardStats } from "./components/dashboard/DashboardStats";
import { Button } from "./components/common/Button";
import { Todo, Expense, DashboardStats as DashboardStatsType } from "./types";

function AppContent() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "todos" | "expenses"
  >("dashboard");
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [stats, setStats] = useState<DashboardStatsType>({
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
    totalExpenses: 0,
    totalIncome: 0,
    balance: 0,
  });

  // Calculate dashboard stats
  useEffect(() => {
    const totalTodos = state.todos.length;
    const completedTodos = state.todos.filter((todo) => todo.completed).length;
    const pendingTodos = totalTodos - completedTodos;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = state.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear &&
        expense.type === "expense"
      );
    });

    const monthlyIncome = state.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear &&
        expense.type === "income"
      );
    });

    const totalExpenses = monthlyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalIncome = monthlyIncome.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    setStats({
      totalTodos,
      completedTodos,
      pendingTodos,
      totalExpenses,
      totalIncome,
      balance: totalIncome - totalExpenses,
    });
  }, [state.todos, state.expenses]);

  // Todo handlers
  const handleAddTodo = (todoData: Omit<Todo, "id" | "createdAt">) => {
    const newTodo: Todo = {
      ...todoData,
      id: uuidv4(),
      createdAt: new Date(),
    };

    if (editingTodo) {
      dispatch({
        type: "UPDATE_TODO",
        payload: { ...editingTodo, ...todoData },
      });
      setEditingTodo(undefined);
    } else {
      dispatch({ type: "ADD_TODO", payload: newTodo });
    }
  };

  const handleToggleTodo = (id: string) => {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
      dispatch({
        type: "UPDATE_TODO",
        payload: { ...todo, completed: !todo.completed },
      });
    }
  };

  const handleDeleteTodo = (id: string) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setActiveTab("todos");
  };

  // Expense handlers
  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4(),
    };

    if (editingExpense) {
      dispatch({
        type: "UPDATE_EXPENSE",
        payload: { ...editingExpense, ...expenseData },
      });
      setEditingExpense(undefined);
    } else {
      dispatch({ type: "ADD_EXPENSE", payload: newExpense });
    }
  };

  const handleDeleteExpense = (id: string) => {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveTab("expenses");
  };

  // Get recent transactions
  const recentExpenses = [...state.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  TaskFlow Manager
                </h1>
                <p className="text-sm text-gray-600">
                  Organize tasks, track expenses, boost productivity
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant={activeTab === "dashboard" ? "primary" : "secondary"}
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant={activeTab === "todos" ? "primary" : "secondary"}
                onClick={() => setActiveTab("todos")}
                className="flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Tasks</span>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <>
            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Tasks
                </h2>
                <TodoList
                  todos={state.todos.slice(0, 5)}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Transactions
                </h2>
                <ExpenseList
                  expenses={recentExpenses}
                  onDelete={handleDeleteExpense}
                  onEdit={handleEditExpense}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "todos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TodoList
                todos={state.todos}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
              />
            </div>

            <div>
              <TodoForm
                onSubmit={handleAddTodo}
                initialData={editingTodo}
                categories={state.categories}
              />
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ExpenseList
                expenses={state.expenses}
                onDelete={handleDeleteExpense}
                onEdit={handleEditExpense}
              />
            </div>

            <div>
              <ExpenseForm
                onSubmit={handleAddExpense}
                initialData={editingExpense}
                categories={state.categories}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>
              TaskFlow Manager © {new Date().getFullYear()} - Your productivity
              companion
            </p>
            <p className="mt-1">
              Organize your day, track your expenses, achieve your goals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
