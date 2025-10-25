import { useEffect, useState } from "react";
import TaskItem from "./taskItem";
import { getTasks, deleteTask } from "../api";
import { groupTasksByDate } from "../group/groupTasksByDate";

// Toast Component
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  setTimeout(onClose, 2000);
  return (
    <div className="fixed top-20 right-6 bg-[#a47376] text-white px-4 py-2 rounded-md shadow-md text-sm z-50 animate-fadeInOut">
      {message}
    </div>
  );
};

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [displayedTasks, setDisplayedTasks] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      const incomplete = data
        .filter((t) => !t.completed)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setTasks(incomplete);
      setDisplayedTasks(incomplete.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDone = (id: number) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    setDisplayedTasks(updatedTasks.slice(0, 5));
    setToastMessage("Task marked as completed!");
  };

  const handleDelete = async (id: number, title: string) => {
    try {
      await deleteTask(id);
      const updatedTasks = tasks.filter((t) => t.id !== id);
      setTasks(updatedTasks);
      setDisplayedTasks(updatedTasks.slice(0, 5));
      setToastMessage(`Task "${title}" deleted successfully!`);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setToastMessage(`Failed to delete task "${title}".`);
    }
  };

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

      <div className="flex-1 overflow-y-auto max-h-[70vh] pr-2">
        {displayedTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks available.</p>
        ) : (
          Object.keys(grouped).map((dateKey) => (
            <div key={dateKey} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-[1px] bg-gray-200 flex-1" />
                <p className="text-xs text-gray-500 whitespace-nowrap">{dateKey}</p>
                <div className="h-[1px] bg-gray-200 flex-1" />
              </div>

              {grouped[dateKey].map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDone={handleDone}
                  onDelete={() => handleDelete(task.id, task.title)}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Toast */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
