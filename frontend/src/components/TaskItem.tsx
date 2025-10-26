import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { completeTask } from "../api";
import EditTaskModal from "./editTaskModal"; 
interface TaskItemProps {
  task: {
    id: number;
    title: string;
    description?: string | null;
    date?: string | null;
    completed: boolean;
  };
  onDone?: (id: number) => void;
  onDelete?: () => void; 
  onUpdate?: (updatedTask: any) => void;
}

export default function TaskItem({ task, onDone, onDelete, onUpdate }: TaskItemProps) {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDoneClick = async () => {
    if (loadingComplete || task.completed) return;
    setLoadingComplete(true);
    try {
      await completeTask(task.id);
      if (onDone) onDone(task.id);
    } catch (err) {
      console.error("Failed to mark task done:", err);
    } finally {
      setLoadingComplete(false);
    }
  };

  const handleDeleteClick = async () => {
    if (loadingDelete) return;
    setLoadingDelete(true);
    try {
      if (onDelete) await onDelete();
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSaveEdit = (updatedTask: any) => {
    if (onUpdate) onUpdate(updatedTask);
    setShowEditModal(false);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB");
    } catch {
      return dateString;
    }
  };

  return (
    <>
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
            <button
              onClick={() => setShowEditModal(true)} 
              className="p-1 text-[#a47376] hover:text-[#8b5b5e] transition"
            >
              <Edit size={18} />
            </button>

            <button
              onClick={handleDeleteClick}
              className={`p-1 transition ${
                loadingDelete
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#a47376] hover:text-red-900"
              }`}
              disabled={loadingDelete}
            >
              <Trash size={18} />
            </button>

            <button
              onClick={handleDoneClick}
              className={`text-sm px-3 py-1 rounded-md transition ${
                task.completed
                  ? "bg-green-200 text-green-700 cursor-not-allowed"
                  : "bg-[#a47376] text-white hover:bg-[#8b5b5e]"
              }`}
              disabled={task.completed || loadingComplete}
            >
              {task.completed
                ? "Done ✓"
                : loadingComplete
                ? "Saving..."
                : "Done"}
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
