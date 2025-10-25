export const API_BASE = "http://localhost:3000"; 

// Get tasks
export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return data.map(task => ({ ...task, done: task.completed }));
}

// Create task
export async function createTask(task: { title: string; description?: string; date?: string }) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  const data = await res.json();
  return { ...data, done: data.completed };
}

// Complete task
export async function completeTask(id: number) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to mark task completed");
  return await res.json(); 
}

// Delete task
export async function deleteTask(id: number | string) {
  
  const cleanId = id.toString().trim();

  const res = await fetch(`${API_BASE}/tasks/${cleanId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }, 
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete task");
  }

  const data = await res.json();
  return data; 
}
