import { render, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ThemeSelector from "../ThemeSelector";
import type { ThemeValue } from "../../types";

describe("ThemeSelector", () => {
  const mockOnChange = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct label", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByText(/theme/i)).toBeInTheDocument();
  });

  it("renders all theme options", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    // Check that all theme options are rendered
    expect(screen.getByLabelText(/adventure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fantasy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/friendship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mystery/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/science fiction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comedy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/educational/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nature/i)).toBeInTheDocument();
  });

  it("shows selected themes as checked", () => {
    const selectedThemes: ThemeValue[] = ["ADVENTURE", "FANTASY"];
    render(
      <ThemeSelector
        selected={selectedThemes}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByLabelText(/adventure/i)).toBeChecked();
    expect(screen.getByLabelText(/fantasy/i)).toBeChecked();
    expect(screen.getByLabelText(/friendship/i)).not.toBeChecked();
  });

  it("calls onChange when a theme is selected", async () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const adventureCheckbox = screen.getByLabelText(/adventure/i);
    await user.click(adventureCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(["ADVENTURE"]);
  });

  it("calls onChange when a theme is deselected", async () => {
    const selectedThemes: ThemeValue[] = ["ADVENTURE", "FANTASY"];
    render(
      <ThemeSelector
        selected={selectedThemes}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const adventureCheckbox = screen.getByLabelText(/adventure/i);
    await user.click(adventureCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(["FANTASY"]);
  });

  it("handles multiple theme selection", async () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const adventureCheckbox = screen.getByLabelText(/adventure/i);
    const fantasyCheckbox = screen.getByLabelText(/fantasy/i);

    await user.click(adventureCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith(["ADVENTURE"]);

    await user.click(fantasyCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith(["ADVENTURE", "FANTASY"]);
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={true}
        error=""
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it("is enabled when disabled prop is false", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeDisabled();
    });
  });

  it("displays error message when error prop is provided", () => {
    const errorMessage = "At least one theme is required";
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("does not display error message when error prop is empty", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    // Check that no error message is displayed
    const errorElements = screen.queryAllByRole("alert");
    expect(errorElements).toHaveLength(0);
  });

  it("applies error styling when error is present", () => {
    const errorMessage = "At least one theme is required";
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error={errorMessage}
      />
    );

    const container = screen.getByText(/theme/i).closest("div");
    expect(container).toHaveClass("border-red-500");
  });

  it("applies normal styling when no error is present", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const container = screen.getByText(/theme/i).closest("div");
    expect(container).toHaveClass("border-gray-300");
  });

  it("applies disabled styling when disabled", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={true}
        error=""
      />
    );

    const container = screen.getByText(/theme/i).closest("div");
    expect(container).toHaveClass("bg-gray-100", "cursor-not-allowed");
  });

  it("applies normal styling when not disabled", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const container = screen.getByText(/theme/i).closest("div");
    expect(container).not.toHaveClass("bg-gray-100", "cursor-not-allowed");
  });

  it("handles keyboard navigation", async () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const adventureCheckbox = screen.getByLabelText(/adventure/i);
    const fantasyCheckbox = screen.getByLabelText(/fantasy/i);

    await user.tab();
    expect(adventureCheckbox).toHaveFocus();

    await user.tab();
    expect(fantasyCheckbox).toHaveFocus();
  });

  it("handles space key to toggle selection", async () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const adventureCheckbox = screen.getByLabelText(/adventure/i);
    adventureCheckbox.focus();

    await user.keyboard(" ");
    expect(mockOnChange).toHaveBeenCalledWith(["ADVENTURE"]);
  });

  it("handles enter key to toggle selection", async () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const adventureCheckbox = screen.getByLabelText(/adventure/i);
    adventureCheckbox.focus();

    await user.keyboard("{Enter}");
    expect(mockOnChange).toHaveBeenCalledWith(["ADVENTURE"]);
  });

  it("maintains selection state correctly", () => {
    const selectedThemes: ThemeValue[] = ["ADVENTURE", "FANTASY", "FRIENDSHIP"];
    const { rerender } = render(
      <ThemeSelector
        selected={selectedThemes}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByLabelText(/adventure/i)).toBeChecked();
    expect(screen.getByLabelText(/fantasy/i)).toBeChecked();
    expect(screen.getByLabelText(/friendship/i)).toBeChecked();

    // Rerender with different selection
    rerender(
      <ThemeSelector
        selected={["MYSTERY"]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByLabelText(/adventure/i)).not.toBeChecked();
    expect(screen.getByLabelText(/fantasy/i)).not.toBeChecked();
    expect(screen.getByLabelText(/friendship/i)).not.toBeChecked();
    expect(screen.getByLabelText(/mystery/i)).toBeChecked();
  });

  it("handles rapid clicking without issues", async () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const adventureCheckbox = screen.getByLabelText(/adventure/i);
    const fantasyCheckbox = screen.getByLabelText(/fantasy/i);

    // Rapid clicking
    await user.click(adventureCheckbox);
    await user.click(fantasyCheckbox);
    await user.click(adventureCheckbox);
    await user.click(fantasyCheckbox);

    expect(mockOnChange).toHaveBeenCalledTimes(4);
  });

  it("renders all theme options with correct values", () => {
    render(
      <ThemeSelector
        selected={[]}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    // Check that all expected themes are present
    const expectedThemes = [
      "ADVENTURE",
      "FANTASY",
      "FRIENDSHIP",
      "MYSTERY",
      "SCIENCE_FICTION",
      "COMEDY",
      "EDUCATIONAL",
      "NATURE",
    ];

    expectedThemes.forEach((theme) => {
      const checkbox = screen.getByDisplayValue(theme);
      expect(checkbox).toBeInTheDocument();
    });
  });
});
