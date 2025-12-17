export function exportToCSV(data: any[], filename: string): void {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const cell = row[header];
          if (cell === null || cell === undefined) return "";
          const stringCell =
            typeof cell === "object" ? JSON.stringify(cell) : String(cell);
          return /[",\n]/.test(stringCell)
            ? `"${stringCell.replace(/"/g, '""')}"`
            : stringCell;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTasks(tasks: any[]) {
  const simplified = tasks.map((task) => ({
    Title: task.title,
    Description: task.description || "",
    Priority: task.priority,
    Status: task.completed ? "Completed" : "Pending",
    "Due Date": task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
    Category: task.category || "",
    "Created At": new Date(task.createdAt).toLocaleDateString(),
    "Completed At": task.completedAt
      ? new Date(task.completedAt).toLocaleDateString()
      : "",
  }));

  exportToCSV(simplified, "tasks_export");
}

export function exportExpenses(expenses: any[]) {
  const simplified = expenses.map((expense) => ({
    Date: new Date(expense.date).toLocaleDateString(),
    Description: expense.title,
    Amount: expense.amount,
    Type: expense.type,
    Category: expense.category,
    Tags: expense.tags?.join(", ") || "",
    Notes: expense.description || "",
  }));

  exportToCSV(simplified, "expenses_export");
}
