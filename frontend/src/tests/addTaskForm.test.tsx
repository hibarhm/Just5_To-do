import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddTaskForm from "../components/addTaskForm";
import * as api from "../api";

vi.mock("../api");

describe("AddTaskForm", () => {
  const fakeTask = {
    id: 1,
    title: "Buy groceries",
    date: "2025-10-27",
    description: "Pick up milk and eggs",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all input fields", () => {
    render(<AddTaskForm />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  it("shows error when submitting with an empty title", async () => {
    render(<AddTaskForm />);
    fireEvent.click(screen.getByText(/done/i));
    expect(await screen.findByText(/please enter a title/i)).toBeInTheDocument();
  });

  it("calls createTask and onTaskCreated when form is filled", async () => {
    const mockCreateTask = vi.spyOn(api, "createTask").mockResolvedValue(fakeTask);
    const handleTaskCreated = vi.fn();

    render(<AddTaskForm onTaskCreated={handleTaskCreated} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: fakeTask.title } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: fakeTask.date } });
    fireEvent.change(screen.getByLabelText(/task description/i), { target: { value: fakeTask.description } });

    fireEvent.click(screen.getByText(/done/i));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: fakeTask.title,
        date: fakeTask.date,
        description: fakeTask.description,
      });
      expect(handleTaskCreated).toHaveBeenCalledWith(fakeTask);
    });

    expect(screen.getByText(/task added/i)).toBeInTheDocument();
  });
});
