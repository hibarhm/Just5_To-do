import { useEffect, useState } from "react";
import TaskItem from "./taskItem";
import { getTasks } from "../api";
import { groupTasksByDate } from "../group/groupTasksByDate"; // ✅ new helper import

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]); // All incomplete tasks from backend
  const [displayedTasks, setDisplayedTasks] = useState<any[]>([]); // Up to 5 shown

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const data = await getTasks();

      // Filter incomplete tasks and sort by due date ascending
      const incomplete = data
        .filter((t) => !t.completed)
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setTasks(incomplete);
      setDisplayedTasks(incomplete.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle Done button click
  const handleDone = (id: number) => {
    // Remove task from all tasks
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);

    // Update displayed tasks (show up to 5 upcoming)
    setDisplayedTasks(updatedTasks.slice(0, 5));
  };

  // ✅ Group tasks by date for display
  const grouped = groupTasksByDate(displayedTasks);

  return (
    <div className="w-full md:w-2/4 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 mx-auto flex flex-col h-full">
      <h2 className="text-[#a47376] font-semibold text-lg mb-4 flex items-center gap-2">
        <img
          src="https://img.icons8.com/?size=100&id=t4MmyHJtYtvk&format=png&color=000000"
          alt="Task Icon"
          className="w-5 h-5"
        />
        To-Do
      </h2>

      <p className="text-gray-500 text-sm mb-2">Upcoming Tasks</p>

      {/* Scrollable task list container */}
      <div className="flex-1 overflow-y-auto max-h-[70vh] pr-2">
        {displayedTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks available.</p>
        ) : (
          Object.keys(grouped).map((dateKey) => (
            <div key={dateKey} className="mb-6">
              {/* 📅 Date header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-[1px] bg-gray-200 flex-1" />
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {dateKey}
                </p>
                <div className="h-[1px] bg-gray-200 flex-1" />
              </div>

              {/* Render all tasks under this date */}
              {grouped[dateKey].map((task) => (
                <TaskItem key={task.id} task={task} onDone={handleDone} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
