import TaskItem from "./TaskItem";

export default function TaskList() {
  return (
    <div className="w-2/4 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-[#a47376] font-semibold text-lg mb-4 flex items-center gap-2">
        <img 
          src="https://img.icons8.com/?size=100&id=t4MmyHJtYtvk&format=png&color=000000" 
          alt="Task Icon" 
          className="w-5 h-5"
        />
        To-Do
      </h2>

      <p className="text-gray-500 text-sm mb-2">24 June - Today</p>
      <TaskItem />
      <TaskItem />

      <p className="text-gray-500 text-sm mt-4 mb-2">25 June - Tomorrow</p>
      <TaskItem />
    </div>
  );
}