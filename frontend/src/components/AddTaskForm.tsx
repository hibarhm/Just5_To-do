import { useState } from "react";
import { Calendar } from "lucide-react";

export default function AddTaskForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="w-2/4 p-6 border border-gray-300 rounded-md bg-[#f9f9f9]">
      <h2 className="text-lg font-semibold text-[#3b3b3b] mb-4">
        Add New Task
      </h2>

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
        />
        <Calendar className="absolute right-3 bottom-3 text-gray-400 w-4 h-4" />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Start writing here......"
          className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:ring-2 focus:ring-[#a47376] focus:outline-none"
        />
      </div>

      <button className="bg-[#a47376] text-white px-6 py-2 rounded-md hover:bg-[#8b5b5e] transition">
        Done
      </button>
    </div>
  );
}
