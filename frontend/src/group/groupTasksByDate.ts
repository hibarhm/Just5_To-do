export function groupTasksByDate(tasks: any[]) {
  if (!Array.isArray(tasks)) return {};

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatLabel = (date: Date) => {
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const options = { day: "numeric", month: "short" } as const;
    const formatted = date.toLocaleDateString("en-GB", options);

    if (isToday) return `${formatted} • Today`;
    if (isTomorrow) return `${formatted} • Tomorrow`;

    return `${formatted} • ${date.toLocaleDateString("en-GB", {
      weekday: "short",
    })}`;
  };

  const groups: Record<string, any[]> = {};

  for (const task of tasks) {
    if (!task.date) continue;
    const dateObj = new Date(task.date);
    const label = formatLabel(dateObj);

    if (!Array.isArray(groups[label])) {
      groups[label] = [];
    }

    groups[label].push(task);
  }

  return groups;
}
