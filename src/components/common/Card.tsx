import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Card({ children, className, title, subtitle }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-xl shadow-sm border border-secondary-200",
          "p-6 transition-all hover:shadow-md"
        ),
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-secondary-900">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-sm text-secondary-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
