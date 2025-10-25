import { Edit, Trash } from "lucide-react";
import { completeTask } from "../api";

interface TaskItemProps {
  task: {
    id: number;
    title: string;
    description?: string | null;
    date?: string | null;
    completed: boolean;
  };
  onDone?: (id: number) => void; // callback to remove task from frontend
}

export default function TaskItem({ task, onDone }: TaskItemProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    } catch {
      return dateString;
    }
  };

  const handleDoneClick = async () => {
    try {
      await completeTask(task.id); // mark completed in backend
      if (onDone) onDone(task.id); // remove from frontend
    } catch (err) {
      console.error("Failed to mark task done:", err);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 px-5 py-4 mb-4 shadow-sm transition-all duration-200 ${
        task.completed
          ? "bg-green-50 opacity-80"
          : "bg-white hover:shadow-md hover:-translate-y-[2px]"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`font-semibold text-gray-800 mb-1 text-[15px] ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-sm ${
                task.completed ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}

          {task.date && (
            <p className="text-xs text-gray-400 mt-2">
              Due: {formatDate(task.date)}
            </p>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <button className="p-1 text-[#a47376] hover:text-[#8b5b5e] transition">
            <Edit size={18} />
          </button>

          <button className="p-1 text-[#a47376] hover:text-[#8b5b5e] transition">
            <Trash size={18} />
          </button>

          <button
            onClick={handleDoneClick}
            className={`text-sm px-3 py-1 rounded-md transition ${
              task.completed
                ? "bg-green-200 text-green-700 cursor-not-allowed"
                : "bg-[#a47376] text-white hover:bg-[#8b5b5e]"
            }`}
            disabled={task.completed}
          >
            {task.completed ? "Done ✓" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
