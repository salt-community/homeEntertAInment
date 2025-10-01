import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/utils";
import { ChatInterface } from "../ChatInterface";
import * as chatService from "../../services/chatService";

// Mock the chat service
vi.mock("../../services/chatService", () => ({
  ChatService: {
    getChatEntries: vi.fn(),
    createChatEntry: vi.fn(),
    createChatBot: vi.fn(),
  },
}));

// Mock the API client
vi.mock("../../services/apiClient", () => ({
  useAuthenticatedFetch: () => vi.fn(),
}));

const mockChatEntries = [
  {
    id: 1,
    chatbotId: 1,
    sessionId: 1,
    creator: "PLAYER",
    content: "What happens when I land on GO?",
    createdAt: "2023-01-01T10:00:00Z",
  },
  {
    id: 2,
    chatbotId: 1,
    sessionId: 1,
    creator: "AI",
    content: "When you land on GO, you collect $200.",
    createdAt: "2023-01-01T10:01:00Z",
  },
];

describe("ChatInterface", () => {
  const mockSessionId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(chatService.ChatService.getChatEntries).mockResolvedValue(
      mockChatEntries
    );
    vi.mocked(chatService.ChatService.createChatBot).mockResolvedValue({
      id: 1,
      name: "Board Game Rules Assistant",
      isActive: true,
      sessionId: 1,
      createdAt: "2023-01-01T09:00:00Z",
    });
  });

  it("renders chat interface with header", async () => {
    render(<ChatInterface sessionId={mockSessionId} />);

    expect(screen.getByText("Board Game Rules Assistant")).toBeInTheDocument();
    expect(
      screen.getByText("Ask questions about game rules and get instant help!")
    ).toBeInTheDocument();
  });

  it("displays chat entries when loaded", async () => {
    render(<ChatInterface sessionId={mockSessionId} />);

    await waitFor(() => {
      expect(
        screen.getByText("What happens when I land on GO?")
      ).toBeInTheDocument();
      expect(
        screen.getByText("When you land on GO, you collect $200.")
      ).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    vi.mocked(chatService.ChatService.getChatEntries).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ChatInterface sessionId={mockSessionId} />);

    expect(screen.getByText("Loading chat history...")).toBeInTheDocument();
  });

  it("shows empty state when no messages", async () => {
    vi.mocked(chatService.ChatService.getChatEntries).mockResolvedValue([]);

    render(<ChatInterface sessionId={mockSessionId} />);

    await waitFor(() => {
      expect(screen.getByText("No messages yet.")).toBeInTheDocument();
      expect(
        screen.getByText("Start a conversation by asking a question!")
      ).toBeInTheDocument();
    });
  });

  it("allows user to send a message", async () => {
    const user = userEvent.setup();
    const mockCreateChatEntry = vi.mocked(
      chatService.ChatService.createChatEntry
    );
    mockCreateChatEntry.mockResolvedValue({
      id: 3,
      chatbotId: 1,
      sessionId: 1,
      creator: "PLAYER",
      content: "New test message",
      createdAt: "2023-01-01T10:02:00Z",
    });

    render(<ChatInterface sessionId={mockSessionId} />);

    const input = screen.getByPlaceholderText(
      "Ask a question about the game rules..."
    );
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(input, "New test message");
    await user.click(sendButton);

    expect(mockCreateChatEntry).toHaveBeenCalledWith(
      mockSessionId,
      {
        content: "New test message",
        creator: "PLAYER",
      },
      expect.any(Function)
    );
  });

  it("disables send button when input is empty", () => {
    render(<ChatInterface sessionId={mockSessionId} />);

    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it("enables send button when input has content", async () => {
    const user = userEvent.setup();
    render(<ChatInterface sessionId={mockSessionId} />);

    const input = screen.getByPlaceholderText(
      "Ask a question about the game rules..."
    );
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(input, "Test message");
    expect(sendButton).not.toBeDisabled();
  });

  it("shows AI thinking indicator when waiting for response", async () => {
    const user = userEvent.setup();
    const mockCreateChatEntry = vi.mocked(
      chatService.ChatService.createChatEntry
    );

    // Mock a delayed response
    mockCreateChatEntry.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: 3,
                chatbotId: 1,
                sessionId: 1,
                creator: "PLAYER",
                content: "Test message",
                createdAt: "2023-01-01T10:02:00Z",
              }),
            100
          )
        )
    );

    render(<ChatInterface sessionId={mockSessionId} />);

    const input = screen.getByPlaceholderText(
      "Ask a question about the game rules..."
    );
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(input, "Test message");
    await user.click(sendButton);

    // Should show sending indicator
    expect(screen.getByText("Sending...")).toBeInTheDocument();
  });

  it("displays error message when chat loading fails", async () => {
    vi.mocked(chatService.ChatService.getChatEntries).mockRejectedValue(
      new Error("Failed to load chat entries")
    );

    render(<ChatInterface sessionId={mockSessionId} />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load chat entries")
      ).toBeInTheDocument();
    });
  });

  it("displays error message when sending message fails", async () => {
    const user = userEvent.setup();
    vi.mocked(chatService.ChatService.createChatEntry).mockRejectedValue(
      new Error("Failed to send message")
    );

    render(<ChatInterface sessionId={mockSessionId} />);

    const input = screen.getByPlaceholderText(
      "Ask a question about the game rules..."
    );
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(input, "Test message");
    await user.click(sendButton);

    await waitFor(
      () => {
        expect(screen.getByText("Failed to send message")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("formats timestamps correctly", async () => {
    render(<ChatInterface sessionId={mockSessionId} />);

    await waitFor(() => {
      // Check that timestamps are displayed (exact format may vary by locale)
      const timestamps = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}/);
      expect(timestamps.length).toBeGreaterThan(0);
    });
  });

  it("distinguishes between player and AI messages visually", async () => {
    render(<ChatInterface sessionId={mockSessionId} />);

    await waitFor(() => {
      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("AI Assistant")).toBeInTheDocument();
    });
  });

  it("clears input after sending message", async () => {
    const user = userEvent.setup();
    vi.mocked(chatService.ChatService.createChatEntry).mockResolvedValue({
      id: 3,
      chatbotId: 1,
      sessionId: 1,
      creator: "PLAYER",
      content: "Test message",
      createdAt: "2023-01-01T10:02:00Z",
    });

    render(<ChatInterface sessionId={mockSessionId} />);

    const input = screen.getByPlaceholderText(
      "Ask a question about the game rules..."
    );
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(input, "Test message");
    expect(input).toHaveValue("Test message");

    await user.click(sendButton);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });
});
