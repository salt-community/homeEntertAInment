/**
 * API configuration and base URL management
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  SESSIONS: `${API_BASE_URL}/api/boardgame/sessions`,
  SESSIONS_ACTIVE: `${API_BASE_URL}/api/boardgame/sessions/active`,
  SESSION_BY_ID: (id: string) => `${API_BASE_URL}/api/boardgame/sessions/${id}`,
  SESSION_BY_NUMERIC_ID: (id: number) => `${API_BASE_URL}/api/boardgame/sessions/by-id/${id}`,
  SESSIONS_BY_USER: (userId: string) =>
    `${API_BASE_URL}/api/boardgame/sessions/user/${userId}`,
  SESSIONS_CREATE_WITH_RULES: `${API_BASE_URL}/api/boardgame/sessions/create-with-rules`,
  RULESETS: `${API_BASE_URL}/api/boardgame/rulesets`,
  RULESET_BY_ID: (id: number) => `${API_BASE_URL}/api/boardgame/rulesets/${id}`,
  RULESET_BY_FILENAME: (fileName: string) =>
    `${API_BASE_URL}/api/boardgame/rulesets/filename/${fileName}`,
  RULESETS_BY_EXTENSION: (fileExt: string) =>
    `${API_BASE_URL}/api/boardgame/rulesets/extension/${fileExt}`,
  // Chat endpoints
  CHAT_ENTRIES: (sessionId: number) => `${API_BASE_URL}/api/sessions/${sessionId}/chatEntries`,
  CREATE_CHAT_ENTRY: (sessionId: number) => `${API_BASE_URL}/api/sessions/${sessionId}/chatEntry`,
  CREATE_CHATBOT: (sessionId: number) => `${API_BASE_URL}/api/sessions/${sessionId}/chatbot`,
} as const;

export default API_BASE_URL;
