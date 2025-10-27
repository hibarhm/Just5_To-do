import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TaskList from "../components/taskList";
import * as api from "../api";

vi.mock("../api");

describe("TaskList Component", () => {
  it("renders fetched tasks correctly", async () => {
    // mock the API response
    (api.getTasks as any).mockResolvedValue([
      {
        id: 1,
        title: "Buy groceries",
        description: "Milk and eggs",
        date: "2025-10-27",
        completed: false,
      },
      {
        id: 2,
        title: "Finish report",
        description: "Work summary report",
        date: "2025-10-28",
        completed: false,
      },
    ]);

    render(<TaskList />);

    // Wait for tasks to appear after fetching
    await waitFor(() => {
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Finish report")).toBeInTheDocument();
    });

    // Optional: check section headings
    expect(screen.getByText(/to-do/i)).toBeInTheDocument();
    expect(screen.getByText(/upcoming tasks/i)).toBeInTheDocument();
  });
});
