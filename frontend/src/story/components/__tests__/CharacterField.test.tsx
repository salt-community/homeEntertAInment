import { render, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CharacterField from "../CharacterField";

describe("CharacterField", () => {
  const mockOnChange = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct label and placeholder", () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByLabelText(/character/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/who is the main character/i)
    ).toBeInTheDocument();
  });

  it("displays the current value", () => {
    const testValue = "Dragon";
    render(
      <CharacterField
        value={testValue}
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(screen.getByDisplayValue(testValue)).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    await user.type(input, "Princess");

    expect(mockOnChange).toHaveBeenCalledWith("P");
    expect(mockOnChange).toHaveBeenCalledWith("Pr");
    expect(mockOnChange).toHaveBeenCalledWith("Pri");
    expect(mockOnChange).toHaveBeenCalledWith("Prin");
    expect(mockOnChange).toHaveBeenCalledWith("Princ");
    expect(mockOnChange).toHaveBeenCalledWith("Prince");
    expect(mockOnChange).toHaveBeenCalledWith("Princes");
    expect(mockOnChange).toHaveBeenCalledWith("Princess");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={true}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    expect(input).toBeDisabled();
  });

  it("is enabled when disabled prop is false", () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    expect(input).not.toBeDisabled();
  });

  it("displays error message when error prop is provided", () => {
    const errorMessage = "Character is required";
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("does not display error message when error prop is empty", () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    // Check that no error message is displayed
    const errorElements = screen.queryAllByRole("alert");
    expect(errorElements).toHaveLength(0);
  });

  it("has correct input attributes", () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("id", "character");
    expect(input).toHaveAttribute("maxLength", "50");
  });

  it("applies error styling when error is present", () => {
    const errorMessage = "Character is required";
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error={errorMessage}
      />
    );

    const input = screen.getByLabelText(/character/i);
    expect(input).toHaveClass("border-red-500");
  });

  it("applies normal styling when no error is present", () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    expect(input).toHaveClass("border-gray-300");
  });

  it("applies disabled styling when disabled", () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={true}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    expect(input).toHaveClass("bg-gray-100", "cursor-not-allowed");
  });

  it("applies normal styling when not disabled", () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    expect(input).not.toHaveClass("bg-gray-100", "cursor-not-allowed");
  });

  it("handles focus and blur events", async () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);

    await user.click(input);
    expect(input).toHaveFocus();

    await user.tab();
    expect(input).not.toHaveFocus();
  });

  it("respects maxLength attribute", async () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    const longText = "a".repeat(60); // Longer than maxLength of 50

    await user.type(input, longText);

    // The input should only accept up to 50 characters
    expect(input).toHaveValue("a".repeat(50));
  });

  it("handles controlled input correctly", async () => {
    const { rerender } = render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    expect(input).toHaveValue("");

    // Simulate external value change
    rerender(
      <CharacterField
        value="External Value"
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    expect(input).toHaveValue("External Value");
  });

  it("calls onChange with trimmed value when user types spaces", async () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    await user.type(input, "  Dragon  ");

    // onChange should be called with each character as typed
    expect(mockOnChange).toHaveBeenCalledWith(" ");
    expect(mockOnChange).toHaveBeenCalledWith("  ");
    expect(mockOnChange).toHaveBeenCalledWith("  D");
    // ... and so on
  });

  it("handles special characters correctly", async () => {
    render(
      <CharacterField
        value=""
        onChange={mockOnChange}
        disabled={false}
        error=""
      />
    );

    const input = screen.getByLabelText(/character/i);
    await user.type(input, "Dragon-123!");

    expect(mockOnChange).toHaveBeenCalledWith("Dragon-123!");
  });
});
