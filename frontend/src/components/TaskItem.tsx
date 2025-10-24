// src/components/taskItem.tsx
import { Edit, Trash } from "lucide-react";

interface TaskItemProps {
  task?: any; // Make task optional with ?
}

export default function TaskItem({ task }: TaskItemProps) {
  // If no task provided, use demo data
  const taskData = task || {
    id: 1,
    title: "Attend Nischal's Birthday Party",
    description: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)...",
    date: "2023-06-24",
    created_at: "2023-06-20"
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch (error) {
      return dateString;
    }
  };

  const formatCreatedAt = (createdAt: string) => {
    if (!createdAt) return '';
    try {
      const date = new Date(createdAt);
      return `Created on: ${date.toLocaleDateString('en-GB')}`;
    } catch (error) {
      return `Created: ${createdAt}`;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 px-4 sm:px-5 py-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">
            {taskData.title}
          </h3>
          {taskData.description && (
            <p className="text-gray-500 text-sm">
              {taskData.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {formatCreatedAt(taskData.created_at)}
            {taskData.date && ` • Due: ${formatDate(taskData.date)}`}
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3 items-center">
          <button className="p-1 text-[#a47376] hover:text-[#8b5b5e]">
            <Edit size={18} />
          </button>
          <button className="p-1 text-[#a47376] hover:text-[#8b5b5e]">
            <Trash size={18} />
          </button>
          <button className="bg-[#a47376] text-white text-sm px-3 py-1 rounded-md hover:bg-[#8b5b5e]">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}