import React, { useState, useEffect, useRef } from 'react';
import type { ChatEntry, CreateChatEntryRequest } from '../types/gameSession';
import { ChatService } from '../services/chatService';

interface ChatInterfaceProps {
  sessionId: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId }) => {
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat entries when component mounts or sessionId changes
  useEffect(() => {
    loadChatEntries();
    initializeChatBot();
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatEntries]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const entries = await ChatService.getChatEntries(sessionId);
      setChatEntries(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat entries');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeChatBot = async () => {
    try {
      await ChatService.createChatBot(sessionId);
    } catch (err) {
      console.warn('Failed to initialize chatbot:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    // Optimistic UI update
    const tempEntry: ChatEntry = {
      id: Date.now(), // Temporary ID
      chatbotId: 0,
      sessionId,
      creator: 'PLAYER',
      content: messageContent,
      createdAt: new Date().toISOString(),
    };
    setChatEntries(prev => [...prev, tempEntry]);

    try {
      const request: CreateChatEntryRequest = {
        content: messageContent,
        creator: 'PLAYER',
      };
      const newEntry = await ChatService.createChatEntry(sessionId, request);
      
      // Replace temporary entry with real one
      setChatEntries(prev => 
        prev.map(entry => 
          entry.id === tempEntry.id ? newEntry : entry
        )
      );
    } catch (err) {
      // Remove temporary entry on error
      setChatEntries(prev => prev.filter(entry => entry.id !== tempEntry.id));
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">
          Board Game Rules Assistant
        </h3>
        <p className="text-sm text-gray-600">
          Ask questions about game rules and get instant help!
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-red-500 hover:text-red-700 mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && chatEntries.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading chat history...</div>
          </div>
        ) : chatEntries.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500 text-center">
              <p>No messages yet.</p>
              <p className="text-sm mt-1">Start a conversation by asking a question!</p>
            </div>
          </div>
        ) : (
          chatEntries.map((entry) => (
            <div
              key={entry.id}
              className={`flex ${entry.creator === 'PLAYER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  entry.creator === 'PLAYER'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{entry.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    entry.creator === 'PLAYER' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTimestamp(entry.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question about the game rules..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
