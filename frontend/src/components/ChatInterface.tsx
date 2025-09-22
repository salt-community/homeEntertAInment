import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ChatEntry, CreateChatEntryRequest } from "../types/gameSession";
import { ChatService } from "../services/chatService";

interface ChatInterfaceProps {
  sessionId: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId }) => {
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const refreshIntervalRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const entries = await ChatService.getChatEntries(sessionId);
      setChatEntries(entries);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load chat entries"
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const startAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    refreshIntervalRef.current = setInterval(() => {
      loadChatEntries();
    }, 2000); // Refresh every 2 seconds
  }, [loadChatEntries]);

  const stopAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  const initializeChatBot = useCallback(async () => {
    try {
      await ChatService.createChatBot(sessionId);
    } catch (err) {
      console.warn("Failed to initialize chatbot:", err);
    }
  }, [sessionId]);

  // Load chat entries when component mounts or sessionId changes
  useEffect(() => {
    loadChatEntries();
    initializeChatBot();

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
    };
  }, [sessionId, loadChatEntries, initializeChatBot, stopAutoRefresh]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatEntries]);

  // Detect new AI responses and stop waiting state
  useEffect(() => {
    if (isWaitingForAI && chatEntries.length > 0) {
      // Check if the last entry is from AI
      const lastEntry = chatEntries[chatEntries.length - 1];
      if (lastEntry.creator === "AI") {
        setIsWaitingForAI(false);
      }
    }
  }, [chatEntries, isWaitingForAI]);

  // Stop auto-refresh when AI is done thinking
  useEffect(() => {
    if (!isWaitingForAI && refreshIntervalRef.current) {
      // Stop auto-refresh immediately when AI is done
      stopAutoRefresh();
    }
  }, [isWaitingForAI, stopAutoRefresh]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSendingMessage) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsSendingMessage(true);
    setIsWaitingForAI(true);

    // Optimistic UI update
    const tempEntry: ChatEntry = {
      id: Date.now(), // Temporary ID
      chatbotId: 0,
      sessionId,
      creator: "PLAYER",
      content: messageContent,
      createdAt: new Date().toISOString(),
    };
    setChatEntries((prev) => [...prev, tempEntry]);

    try {
      const request: CreateChatEntryRequest = {
        content: messageContent,
        creator: "PLAYER",
      };
      const newEntry = await ChatService.createChatEntry(sessionId, request);

      // Replace temporary entry with real one
      setChatEntries((prev) =>
        prev.map((entry) => (entry.id === tempEntry.id ? newEntry : entry))
      );

      // Start auto-refresh to catch AI response
      startAutoRefresh();
    } catch (err) {
      // Remove temporary entry on error
      setChatEntries((prev) =>
        prev.filter((entry) => entry.id !== tempEntry.id)
      );
      setError(err instanceof Error ? err.message : "Failed to send message");
      setIsWaitingForAI(false);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full bg-black border border-gray-800 rounded-lg min-h-0">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-[#F930C7]/10 via-transparent to-[#3076F9]/10 flex-shrink-0">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
          Board Game Rules Assistant
        </h3>
        <p className="text-sm text-white/70">
          Ask questions about game rules and get instant help!
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900/20 border-b border-red-800 flex-shrink-0">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-red-400 hover:text-red-300 mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {isLoading && chatEntries.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-white/60">Loading chat history...</div>
          </div>
        ) : chatEntries.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-white/60 text-center">
              <p>No messages yet.</p>
              <p className="text-sm mt-1">
                Start a conversation by asking a question!
              </p>
            </div>
          </div>
        ) : (
          chatEntries.map((entry) => (
            <div
              key={entry.id}
              className={`flex ${
                entry.creator === "PLAYER" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  entry.creator === "PLAYER"
                    ? "bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white"
                    : entry.creator === "AI"
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-700"
                    : "bg-gray-800 text-white"
                }`}
              >
                <div className="text-xs font-medium mb-1 flex items-center">
                  {entry.creator === "PLAYER" ? (
                    <>
                      <span className="w-2 h-2 bg-white/80 rounded-full mr-1"></span>
                      You
                    </>
                  ) : entry.creator === "AI" ? (
                    <>
                      <span className="w-2 h-2 bg-[#3076F9] rounded-full mr-1"></span>
                      AI Assistant
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                      Assistant
                    </>
                  )}
                </div>
                <p className="text-sm">{entry.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    entry.creator === "PLAYER"
                      ? "text-white/80"
                      : entry.creator === "AI"
                      ? "text-white/60"
                      : "text-white/50"
                  }`}
                >
                  {formatTimestamp(entry.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* AI Thinking Indicator */}
        {isWaitingForAI && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-700">
              <div className="text-xs font-medium mb-1 flex items-center">
                <span className="w-2 h-2 bg-[#3076F9] rounded-full mr-1 animate-pulse"></span>
                AI Assistant
              </div>
              <div className="text-sm flex items-center">
                <span className="animate-pulse">Thinking</span>
                <span className="ml-1 animate-bounce">...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question about the game rules..."
            className="flex-1 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3076F9] focus:border-transparent bg-gray-800 text-white placeholder-white/50"
            style={{ color: "#ffffff", backgroundColor: "#1f2937" }}
            disabled={isSendingMessage}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSendingMessage}
            className="px-4 py-2 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white rounded-md hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSendingMessage ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};
