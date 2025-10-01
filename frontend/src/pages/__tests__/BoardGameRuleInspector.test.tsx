import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../test/utils";
import BoardGameRuleInspector from "../BoardGameRuleInspector";

// Mock the components
vi.mock("../../components", () => ({
  SessionSidebar: ({ className }: { className?: string }) => (
    <div data-testid="session-sidebar" className={className}>
      Session Sidebar
    </div>
  ),
  CreateSessionCard: () => (
    <div data-testid="create-session-card">Create Session Card</div>
  ),
}));

describe("BoardGameRuleInspector", () => {
  it("renders the main layout correctly", () => {
    render(<BoardGameRuleInspector />);

    // Check for main title
    expect(screen.getByText("Board Game Rule Inspector")).toBeInTheDocument();

    // Check for subtitle
    expect(
      screen.getByText("Manage your game sessions and explore rule sets")
    ).toBeInTheDocument();

    // Check for section title
    expect(screen.getByText("Create New Session")).toBeInTheDocument();
  });

  it("renders the sidebar component", () => {
    render(<BoardGameRuleInspector />);

    expect(screen.getByTestId("session-sidebar")).toBeInTheDocument();
    expect(screen.getByText("Session Sidebar")).toBeInTheDocument();
  });

  it("renders the create session card", () => {
    render(<BoardGameRuleInspector />);

    expect(screen.getByTestId("create-session-card")).toBeInTheDocument();
    expect(screen.getByText("Create Session Card")).toBeInTheDocument();
  });

  it("has correct layout structure", () => {
    render(<BoardGameRuleInspector />);

    // Check that the main container has the correct background
    const mainContainer = screen
      .getByText("Board Game Rule Inspector")
      .closest(".min-h-screen");
    expect(mainContainer).toHaveClass("bg-black");

    // Check that sidebar has correct width class
    const sidebar = screen.getByTestId("session-sidebar").closest(".w-80");
    expect(sidebar).toBeInTheDocument();
  });

  it("displays the gradient icon", () => {
    render(<BoardGameRuleInspector />);

    // Check for the SVG icon container
    const iconContainer = document.querySelector(".w-12.h-12");
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass(
      "bg-gradient-to-r",
      "from-[#F930C7]",
      "to-[#3076F9]"
    );
  });

  it("has proper responsive layout", () => {
    render(<BoardGameRuleInspector />);

    // Check for main flex layout with h-screen
    const mainContainer = document.querySelector(".flex.h-screen");
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass("h-screen");
  });

  it("displays gradient text styling", () => {
    render(<BoardGameRuleInspector />);

    const title = screen.getByText("Board Game Rule Inspector");
    expect(title).toHaveClass(
      "bg-gradient-to-r",
      "from-[#3076F9]",
      "to-[#F930C7]",
      "bg-clip-text",
      "text-transparent"
    );

    const sectionTitle = screen.getByText("Create New Session");
    expect(sectionTitle).toHaveClass(
      "bg-gradient-to-r",
      "from-[#3076F9]",
      "to-[#F930C7]",
      "bg-clip-text",
      "text-transparent"
    );
  });
});
