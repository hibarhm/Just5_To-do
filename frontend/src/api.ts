export const API_BASE = "http://localhost:3000";


// Get tasks

export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return data;
}


// Create new task

export async function createTask(task: { title: string; description?: string; date?: string }) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  const data = await res.json();
  return data;
}


// Update task OR Mark as Done

export async function updateTask(id: number, updates?: { title?: string; description?: string | null; date?: string | null }) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: updates ? { "Content-Type": "application/json" } : undefined,
    body: updates ? JSON.stringify(updates) : undefined,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to update task");
  }

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

  return await res.json();
}
