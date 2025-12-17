export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  category: string;
  createdAt: Date;
  estimatedHours?: number;
  aiEnhanced?: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  type: "income" | "expense";
  description?: string;
  tags: string[];
  aiSuggestedCategory?: string;
  aiConfidence?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface DashboardStats {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  productivityScore: number;
}

export type FilterType = "all" | "active" | "completed";
