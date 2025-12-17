import {
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  List,
  Calculator,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { DashboardStats as DashboardStatsType } from "../../types";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Tasks"
        value={stats.totalTodos}
        icon={<List className="w-6 h-6" />}
        subtitle={`${stats.completedTodos} completed, ${stats.pendingTodos} pending`}
      />

      <StatsCard
        title="Completed Tasks"
        value={stats.completedTodos}
        icon={<CheckCircle className="w-6 h-6" />}
        subtitle={`${
          Math.round((stats.completedTodos / stats.totalTodos) * 100) || 0
        }% completion rate`}
      />

      <StatsCard
        title="Pending Tasks"
        value={stats.pendingTodos}
        icon={<Clock className="w-6 h-6" />}
        subtitle="Tasks remaining"
      />

      <StatsCard
        title="Total Expenses"
        value={formatCurrency(stats.totalExpenses)}
        icon={<DollarSign className="w-6 h-6" />}
        subtitle="This month"
      />

      <StatsCard
        title="Total Income"
        value={formatCurrency(stats.totalIncome)}
        icon={<TrendingUp className="w-6 h-6" />}
        subtitle="This month"
      />

      <StatsCard
        title="Balance"
        value={formatCurrency(stats.balance)}
        icon={<Calculator className="w-6 h-6" />}
        subtitle="Current balance"
      />
    </div>
  );
}
