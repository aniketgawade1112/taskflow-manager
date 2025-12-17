import { ReactNode } from "react";
import { Card } from "../common/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  subtitle,
}: StatsCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-secondary-500">{title}</p>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-secondary-500 ml-2">
                {subtitle}
              </span>
            </div>
          )}
          {!trend && subtitle && (
            <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-primary-500 p-3 rounded-full bg-primary-50">
          {icon}
        </div>
      </div>
    </Card>
  );
}
