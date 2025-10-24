// src/api.ts
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export async function createTask(payload: {
  title: string;
  description?: string | null;
  date?: string | null;
}) {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // try to parse error message
    let err = "Server error";
    try {
      const j = await res.json();
      err = j.error || j.message || err;
    } catch {}
    throw new Error(err);
  }

  return res.json(); // created task row
}
