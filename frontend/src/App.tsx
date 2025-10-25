import Navbar from "./components/navbar";
import AddTaskForm from "./components/addTaskForm";
import TaskList from "./components/taskList";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-10 flex gap-8">
        <AddTaskForm />
        <TaskList />
      </main>
    </div>
  );
}
