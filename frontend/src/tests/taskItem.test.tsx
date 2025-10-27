import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TaskItem from "../components/TaskItem";
import * as api from "../api";

vi.mock("../api", () => ({
  updateTask: vi.fn(),
}));

describe("TaskItem", () => {
  const task = {
    id: 1,
    title: "Finish project report",
    description: "Write test section with results",
    date: "2025-10-27",
    completed: false,
  };

  it("marks a task as done when the button is clicked", async () => {
    const handleDone = vi.fn();

    (api.updateTask as vi.Mock).mockResolvedValue({
      ...task,
      completed: true,
    });

    render(<TaskItem task={task} onDone={handleDone} />);

    const doneBtn = screen.getByRole("button", { name: /mark task done/i });

    expect(doneBtn).toHaveTextContent("Done");
    expect(doneBtn).toBeEnabled();

    fireEvent.click(doneBtn);

    expect(doneBtn).toHaveTextContent("Saving...");

    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith(task.id, { completed: true });
      expect(handleDone).toHaveBeenCalledWith(task.id);
    });
  });

  it("triggers delete callback when delete is clicked", async () => {
    const handleDelete = vi.fn();
    render(<TaskItem task={task} onDelete={handleDelete} />);

    const deleteBtn = screen.getByRole("button", { name: /delete task/i });
    fireEvent.click(deleteBtn);

    expect(deleteBtn).toBeDisabled();

    await waitFor(() => expect(handleDelete).toHaveBeenCalled());
    await waitFor(() => expect(deleteBtn).toBeEnabled());
  });

  it("disables Done button if the task is already completed", () => {
    render(<TaskItem task={{ ...task, completed: true }} />);

    const doneBtn = screen.getByRole("button", { name: /task done/i });

    expect(doneBtn).toBeDisabled();
    expect(doneBtn).toHaveTextContent("Done ✓");
  });
});
