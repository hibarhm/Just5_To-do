import { useState, useEffect } from "react";
import { updateTask } from "../api";
import { Calendar } from "lucide-react";
import { Calendar13 } from "./Calendar13";

interface EditTaskModalProps {
  task: {
    id: number;
    title: string;
    description?: string | null;
    date?: string | null;
    completed: boolean;
  };
  onClose: () => void;
  onSave: (updatedTask: any) => void;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [date, setDate] = useState(task.date || "");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task.date ? new Date(task.date) : new Date()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format date for input (YYYY-MM-DD)
  const formatForInput = (dateString?: string | null) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDate(formatForInput(task.date));
    setSelectedDate(task.date ? new Date(task.date) : new Date());
  }, [task]);

  const handleCalendarDone = () => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);
    }
    setShowCalendar(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updates = {
        title: title.trim(),
        description: description || null,
        date: date || null,
      };

      const updatedTask = await updateTask(task.id, updates);
      onSave(updatedTask);
      onClose();
    } catch (err: any) {
      console.error("Failed to update task:", err);
      setError(err.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white w-96 rounded-xl p-6 shadow-lg relative">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Edit Task</h3>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#a47376] focus:outline-none"
            disabled={loading}
          />
        </div>

        {/* Date */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#a47376] focus:outline-none"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="absolute right-3 bottom-3 text-gray-400 hover:text-[#a47376] transition-colors"
            disabled={loading}
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Calendar Popup (beside form) */}
          {showCalendar && (
            <div className="absolute right-[-22rem] top-0 w-80 p-6 border border-gray-300 rounded-md bg-white shadow-lg z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#3b3b3b]">Select Date</h3>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <Calendar13
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
                onDone={handleCalendarDone}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-vertical focus:ring-2 focus:ring-[#a47376] focus:outline-none"
            disabled={loading}
          />
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-[#a47376] text-white hover:bg-[#8b5b5e] transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
