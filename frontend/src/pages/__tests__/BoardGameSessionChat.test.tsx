import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../test/utils";
import BoardGameSessionChat from "../BoardGameSessionChat";

// Mock the router params
vi.mock("@tanstack/react-router", () => ({
  useParams: () => ({
    sessionId: "123",
  }),
}));

// Mock the components
vi.mock("../../components", () => ({
  SessionSidebar: ({ className }: { className?: string }) => (
    <div data-testid="session-sidebar" className={className}>
      Session Sidebar
    </div>
  ),
  ChatInterface: ({ sessionId }: { sessionId: number }) => (
    <div data-testid="chat-interface">
      Chat Interface for session {sessionId}
    </div>
  ),
  SessionInfo: ({ sessionId }: { sessionId: number }) => (
    <div data-testid="session-info">Session Info for session {sessionId}</div>
  ),
}));

describe("BoardGameSessionChat", () => {
  it("renders the main layout correctly", () => {
    render(<BoardGameSessionChat />);

    // Check that all main components are rendered
    expect(screen.getByTestId("session-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("session-info")).toBeInTheDocument();
    expect(screen.getByTestId("chat-interface")).toBeInTheDocument();
  });

  it("passes correct sessionId to components", () => {
    render(<BoardGameSessionChat />);

    // Check that sessionId is passed correctly (converted to number)
    expect(
      screen.getByText("Session Info for session 123")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Chat Interface for session 123")
    ).toBeInTheDocument();
  });

  it("has correct layout structure", () => {
    render(<BoardGameSessionChat />);

    // Check main container
    const mainContainer = screen
      .getByTestId("session-sidebar")
      .closest(".min-h-screen");
    expect(mainContainer).toHaveClass("bg-black");

    // Check sidebar width
    const sidebar = screen.getByTestId("session-sidebar").closest(".w-80");
    expect(sidebar).toBeInTheDocument();

    // Check flex layout
    const flexContainer = screen
      .getByTestId("session-sidebar")
      .closest(".flex");
    expect(flexContainer).toHaveClass("h-screen");
  });

  it("has proper content area layout", () => {
    render(<BoardGameSessionChat />);

    // The main content area should be flex column
    const contentArea = screen.getByTestId("session-info").closest(".flex-1");
    expect(contentArea).toBeInTheDocument();
    expect(contentArea).toHaveClass("flex", "flex-col", "min-h-0");
  });

  it("applies correct padding to session info", () => {
    render(<BoardGameSessionChat />);

    const sessionInfoContainer = screen
      .getByTestId("session-info")
      .closest(".p-6");
    expect(sessionInfoContainer).toBeInTheDocument();
    expect(sessionInfoContainer).toHaveClass("pb-0", "flex-shrink-0");
  });

  it("applies correct padding to chat interface", () => {
    render(<BoardGameSessionChat />);

    const chatContainer = screen.getByTestId("chat-interface").closest(".p-6");
    expect(chatContainer).toBeInTheDocument();
    expect(chatContainer).toHaveClass("pt-4", "min-h-0", "flex-1");
  });

  it("renders sidebar with correct height class", () => {
    render(<BoardGameSessionChat />);

    const sidebar = screen.getByTestId("session-sidebar");
    expect(sidebar).toHaveClass("h-full");
  });
});
