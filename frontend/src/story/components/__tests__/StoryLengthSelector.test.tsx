import { render, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import StoryLengthSelector from "../StoryLengthSelector";

describe("StoryLengthSelector", () => {
  const mockOnChange = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct label", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByText(/story length/i)).toBeInTheDocument();
  });

  it("renders all story length options", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    // Check that all story length options are rendered
    expect(screen.getByLabelText(/short/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/medium/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full/i)).toBeInTheDocument();
  });

  it("shows selected story length as checked", () => {
    render(
      <StoryLengthSelector
        selected="MEDIUM"
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByLabelText(/medium/i)).toBeChecked();
    expect(screen.getByLabelText(/short/i)).not.toBeChecked();
    expect(screen.getByLabelText(/full/i)).not.toBeChecked();
  });

  it("calls onChange when a story length is selected", async () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const shortRadio = screen.getByLabelText(/short/i);
    await user.click(shortRadio);

    expect(mockOnChange).toHaveBeenCalledWith("SHORT");
  });

  it("calls onChange when a different story length is selected", async () => {
    render(
      <StoryLengthSelector
        selected="SHORT"
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const mediumRadio = screen.getByLabelText(/medium/i);
    await user.click(mediumRadio);

    expect(mockOnChange).toHaveBeenCalledWith("MEDIUM");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={true}
        error=""
      />
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("is enabled when disabled prop is false", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((radio) => {
      expect(radio).not.toBeDisabled();
    });
  });

  it("displays error message when error prop is provided", () => {
    const errorMessage = "Story length is required";
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("does not display error message when error prop is empty", () => {
    render(
      <StoryLengthSelector
        selected=""
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
    const errorMessage = "Story length is required";
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error={errorMessage}
      />
    );

    const container = screen.getByText(/story length/i).closest("div");
    expect(container).toHaveClass("border-red-500");
  });

  it("applies normal styling when no error is present", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const container = screen.getByText(/story length/i).closest("div");
    expect(container).toHaveClass("border-gray-300");
  });

  it("applies disabled styling when disabled", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={true}
        error=""
      />
    );

    const container = screen.getByText(/story length/i).closest("div");
    expect(container).toHaveClass("bg-gray-100", "cursor-not-allowed");
  });

  it("applies normal styling when not disabled", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const container = screen.getByText(/story length/i).closest("div");
    expect(container).not.toHaveClass("bg-gray-100", "cursor-not-allowed");
  });

  it("handles keyboard navigation", async () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const shortRadio = screen.getByLabelText(/short/i);
    const mediumRadio = screen.getByLabelText(/medium/i);

    await user.tab();
    expect(shortRadio).toHaveFocus();

    await user.tab();
    expect(mediumRadio).toHaveFocus();
  });

  it("handles arrow key navigation", async () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const shortRadio = screen.getByLabelText(/short/i);
    const mediumRadio = screen.getByLabelText(/medium/i);
    const fullRadio = screen.getByLabelText(/full/i);

    shortRadio.focus();

    await user.keyboard("{ArrowDown}");
    expect(mediumRadio).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(fullRadio).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(mediumRadio).toHaveFocus();
  });

  it("handles space key to select", async () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const shortRadio = screen.getByLabelText(/short/i);
    shortRadio.focus();

    await user.keyboard(" ");
    expect(mockOnChange).toHaveBeenCalledWith("SHORT");
  });

  it("handles enter key to select", async () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const shortRadio = screen.getByLabelText(/short/i);
    shortRadio.focus();

    await user.keyboard("{Enter}");
    expect(mockOnChange).toHaveBeenCalledWith("SHORT");
  });

  it("maintains selection state correctly", () => {
    const { rerender } = render(
      <StoryLengthSelector
        selected="SHORT"
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByLabelText(/short/i)).toBeChecked();
    expect(screen.getByLabelText(/medium/i)).not.toBeChecked();
    expect(screen.getByLabelText(/full/i)).not.toBeChecked();

    // Rerender with different selection
    rerender(
      <StoryLengthSelector
        selected="FULL"
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByLabelText(/short/i)).not.toBeChecked();
    expect(screen.getByLabelText(/medium/i)).not.toBeChecked();
    expect(screen.getByLabelText(/full/i)).toBeChecked();
  });

  it("renders all story length options with correct values", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    // Check that all expected story lengths are present
    const expectedLengths = ["SHORT", "MEDIUM", "FULL"];

    expectedLengths.forEach((length) => {
      const radio = screen.getByDisplayValue(length);
      expect(radio).toBeInTheDocument();
    });
  });

  it("displays correct descriptions for each story length", () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    // Check that descriptions are displayed
    expect(screen.getByText(/~500 words/i)).toBeInTheDocument();
    expect(screen.getByText(/~1000 words/i)).toBeInTheDocument();
    expect(screen.getByText(/~1500 words/i)).toBeInTheDocument();
  });

  it("handles rapid clicking without issues", async () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const shortRadio = screen.getByLabelText(/short/i);
    const mediumRadio = screen.getByLabelText(/medium/i);

    // Rapid clicking
    await user.click(shortRadio);
    await user.click(mediumRadio);
    await user.click(shortRadio);

    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, "SHORT");
    expect(mockOnChange).toHaveBeenNthCalledWith(2, "MEDIUM");
    expect(mockOnChange).toHaveBeenNthCalledWith(3, "SHORT");
  });

  it("handles focus and blur events", async () => {
    render(
      <StoryLengthSelector
        selected=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const shortRadio = screen.getByLabelText(/short/i);

    await user.click(shortRadio);
    expect(shortRadio).toHaveFocus();

    await user.tab();
    expect(shortRadio).not.toHaveFocus();
  });
});
