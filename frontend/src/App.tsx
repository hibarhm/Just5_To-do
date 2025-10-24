import Navbar from "./components/Navbar";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";

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
