import Navbar from "./components/navbar";
import AddTaskForm from "./components/addTaskForm";
import TaskList from "./components/taskList";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-6 md:gap-8">
        <AddTaskForm />
        <TaskList />
      </main>
    </div>
  );
}
