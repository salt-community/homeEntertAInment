import { render, screen, waitFor } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StoryForm from "../StoryForm";
import {
  MockCharacterField,
  MockThemeSelector,
  MockStoryLengthSelector,
  MockSelectField,
  MockTextInput,
} from "./mocks";

// Mock the child components
vi.mock("../CharacterField", () => ({
  default: MockCharacterField,
}));

vi.mock("../ThemeSelector", () => ({
  default: MockThemeSelector,
}));

vi.mock("../StoryLengthSelector", () => ({
  default: MockStoryLengthSelector,
}));

vi.mock("../fields/SelectField", () => ({
  default: MockSelectField,
}));

vi.mock("../fields/TextInput", () => ({
  default: MockTextInput,
}));

describe("StoryForm", () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    expect(screen.getByTestId("character-input")).toBeInTheDocument();
    expect(screen.getByTestId("theme-selector")).toBeInTheDocument();
    expect(screen.getByTestId("ageGroup-select")).toBeInTheDocument();
    expect(screen.getByTestId("story-length-select")).toBeInTheDocument();
    expect(screen.getByTestId("twist-select")).toBeInTheDocument();
    expect(screen.getByTestId("custom-textarea")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create you story/i })
    ).toBeInTheDocument();
  });

  it("disables form when disabled prop is true", () => {
    render(<StoryForm onSubmit={mockOnSubmit} disabled={true} />);

    expect(screen.getByTestId("character-input")).toBeDisabled();
    expect(screen.getByTestId("ageGroup-select")).toBeDisabled();
    expect(screen.getByTestId("story-length-select")).toBeDisabled();
    expect(screen.getByTestId("twist-select")).toBeDisabled();
    expect(screen.getByTestId("custom-textarea")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /create you story/i })
    ).toBeDisabled();
  });

  it("validates required fields and shows errors", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("character-error")).toHaveTextContent(
        "Character is required"
      );
      expect(screen.getByTestId("theme-error")).toHaveTextContent(
        "At least one theme is required"
      );
      expect(screen.getByTestId("ageGroup-error")).toHaveTextContent(
        "Age group is required"
      );
      expect(screen.getByTestId("story-length-error")).toHaveTextContent(
        "Story length is required"
      );
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates character length", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    const characterInput = screen.getByTestId("character-input");
    await user.type(characterInput, "a".repeat(51));

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("character-error")).toHaveTextContent(
        "Character must be 50 characters or less"
      );
    });
  });

  it("validates theme selection limits", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    // Select 3 themes (more than the limit of 2)
    const themeCheckboxes = screen.getAllByRole("checkbox");
    await user.click(themeCheckboxes[0]); // ADVENTURE
    await user.click(themeCheckboxes[1]); // FANTASY
    await user.click(themeCheckboxes[2]); // FRIENDSHIP

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("theme-error")).toHaveTextContent(
        "Maximum 2 themes can be selected"
      );
    });
  });

  it("validates custom field length", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    const customTextarea = screen.getByTestId("custom-textarea");
    await user.type(customTextarea, "a".repeat(201));

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("custom-error")).toHaveTextContent(
        "Custom field must be 200 characters or less"
      );
    });
  });

  it("submits form with valid data", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    // Fill in required fields
    await user.type(screen.getByTestId("character-input"), "Dragon");

    // Select one theme
    const themeCheckboxes = screen.getAllByRole("checkbox");
    await user.click(themeCheckboxes[0]); // ADVENTURE

    // Select age group
    await user.selectOptions(screen.getByTestId("ageGroup-select"), "AGE_7_8");

    // Select story length
    await user.selectOptions(
      screen.getByTestId("story-length-select"),
      "MEDIUM"
    );

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        character: "Dragon",
        theme: ["ADVENTURE"],
        ageGroup: "AGE_7_8",
        storyLength: "MEDIUM",
      });
    });
  });

  it("submits form with optional fields", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    // Fill in all fields
    await user.type(screen.getByTestId("character-input"), "Princess");

    // Select themes
    const themeCheckboxes = screen.getAllByRole("checkbox");
    await user.click(themeCheckboxes[0]); // ADVENTURE
    await user.click(themeCheckboxes[1]); // FANTASY

    // Select age group
    await user.selectOptions(screen.getByTestId("ageGroup-select"), "AGE_5_6");

    // Select story length
    await user.selectOptions(
      screen.getByTestId("story-length-select"),
      "SHORT"
    );

    // Select twist
    await user.selectOptions(screen.getByTestId("twist-select"), "SECRET_DOOR");

    // Add custom content
    await user.type(
      screen.getByTestId("custom-textarea"),
      "A magical adventure"
    );

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        character: "Princess",
        theme: ["ADVENTURE", "FANTASY"],
        ageGroup: "AGE_5_6",
        storyLength: "SHORT",
        twist: "SECRET_DOOR",
        custom: "A magical adventure",
      });
    });
  });

  it("trims whitespace from character and custom fields", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    // Fill in fields with whitespace
    await user.type(screen.getByTestId("character-input"), "  Dragon  ");

    const themeCheckboxes = screen.getAllByRole("checkbox");
    await user.click(themeCheckboxes[0]);

    await user.selectOptions(screen.getByTestId("ageGroup-select"), "AGE_7_8");
    await user.selectOptions(
      screen.getByTestId("story-length-select"),
      "MEDIUM"
    );

    await user.type(
      screen.getByTestId("custom-textarea"),
      "  Custom content  "
    );

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        character: "Dragon",
        theme: ["ADVENTURE"],
        ageGroup: "AGE_7_8",
        storyLength: "MEDIUM",
        custom: "Custom content",
      });
    });
  });

  it("does not include empty optional fields in submission", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    // Fill in only required fields
    await user.type(screen.getByTestId("character-input"), "Hero");

    const themeCheckboxes = screen.getAllByRole("checkbox");
    await user.click(themeCheckboxes[0]);

    await user.selectOptions(screen.getByTestId("ageGroup-select"), "AGE_7_8");
    await user.selectOptions(
      screen.getByTestId("story-length-select"),
      "MEDIUM"
    );

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        character: "Hero",
        theme: ["ADVENTURE"],
        ageGroup: "AGE_7_8",
        storyLength: "MEDIUM",
      });
    });
  });

  it("shows character count for custom field", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    const customTextarea = screen.getByTestId("custom-textarea");
    await user.type(customTextarea, "Hello world");

    expect(screen.getByText("11/200 characters")).toBeInTheDocument();
  });

  it("handles async onSubmit function", async () => {
    const asyncOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<StoryForm onSubmit={asyncOnSubmit} />);

    // Fill in required fields
    await user.type(screen.getByTestId("character-input"), "Dragon");

    const themeCheckboxes = screen.getAllByRole("checkbox");
    await user.click(themeCheckboxes[0]);

    await user.selectOptions(screen.getByTestId("ageGroup-select"), "AGE_7_8");
    await user.selectOptions(
      screen.getByTestId("story-length-select"),
      "MEDIUM"
    );

    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(asyncOnSubmit).toHaveBeenCalled();
    });
  });

  it("clears errors when form is resubmitted with valid data", async () => {
    render(<StoryForm onSubmit={mockOnSubmit} />);

    // First submit with invalid data
    const submitButton = screen.getByRole("button", {
      name: /create you story/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("character-error")).toBeInTheDocument();
    });

    // Fix the data and submit again
    await user.type(screen.getByTestId("character-input"), "Dragon");

    const themeCheckboxes = screen.getAllByRole("checkbox");
    await user.click(themeCheckboxes[0]);

    await user.selectOptions(screen.getByTestId("ageGroup-select"), "AGE_7_8");
    await user.selectOptions(
      screen.getByTestId("story-length-select"),
      "MEDIUM"
    );

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId("character-error")).not.toBeInTheDocument();
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
