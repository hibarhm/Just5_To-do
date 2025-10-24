import { useState } from "react";
import { Calendar } from "lucide-react";
import { Calendar13 } from "./Calendar13";
import { createTask } from "../api";

interface AddTaskFormProps {
  onTaskCreated?: (task: any) => void;
}

export default function AddTaskForm({ onTaskCreated }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalendarDone = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(formattedDate);
    }
    setShowCalendar(false);
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setSelectedDate(new Date());
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description || null,
        date: date || null,
      };

      const created = await createTask(payload);

      if (onTaskCreated) onTaskCreated(created);
      resetForm();
    } catch (err: any) {
      console.error("Create task failed:", err);
      setError(err?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Your original form - completely unchanged layout */}
      <div className="w-2/4 p-6 border border-gray-300 rounded-md bg-[#f9f9f9]">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#3b3b3b] mb-2">
            Add New Task
          </h2>
          <div className="h-1 w-20 bg-[#a47376] rounded-full"></div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#a47376] focus:outline-none"
            disabled={loading}
          />
          {/* Calendar icon button */}
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="absolute right-3 bottom-3 text-gray-400 hover:text-[#a47376] transition-colors"
            disabled={loading}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        {/* Description - Increased size */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <textarea
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Start writing here......"
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-vertical focus:ring-2 focus:ring-[#a47376] focus:outline-none min-h-[150px]"
            disabled={loading}
          />
        </div>

        {/* Error message - placed right above the button without changing layout */}
        {error && (
          <div className="mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <button 
          onClick={handleSubmit}
          className="bg-[#a47376] text-white px-6 py-2 rounded-md hover:bg-[#8b5b5e] transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Done"}
        </button>
      </div>

      {/* Calendar Overlay */}
      {showCalendar && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 p-6 border border-gray-300 rounded-md bg-white shadow-lg z-50">
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
    </>
  );
}