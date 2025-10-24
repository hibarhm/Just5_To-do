import { useState } from "react";
import { Calendar } from "lucide-react";
import { Calendar13 } from "./Calendar13";

export default function AddTaskForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleCalendarDone = () => {
    if (selectedDate) {
      // Format the date as YYYY-MM-DD for the input field
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(formattedDate);
    }
    setShowCalendar(false);
  };

  return (
    <>
      {/* Responsive form container */}
      <div className="w-full md:w-2/4 p-4 sm:p-6 border border-gray-300 rounded-md bg-[#f9f9f9] mx-auto">
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
          {/* Calendar icon button */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="absolute right-3 bottom-3 text-gray-400 hover:text-[#a47376] transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </button>
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
          
          {/* Calendar component with built-in Done button */}
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