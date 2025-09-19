/**
 * API configuration and base URL management
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  SESSIONS: `${API_BASE_URL}/api/boardgame/sessions`,
  SESSIONS_ACTIVE: `${API_BASE_URL}/api/boardgame/sessions/active`,
  SESSION_BY_ID: (id: string) => `${API_BASE_URL}/api/boardgame/sessions/${id}`,
  SESSIONS_BY_USER: (userId: string) =>
    `${API_BASE_URL}/api/boardgame/sessions/user/${userId}`,
  RULESETS: `${API_BASE_URL}/api/boardgame/rulesets`,
  RULESET_BY_ID: (id: number) => `${API_BASE_URL}/api/boardgame/rulesets/${id}`,
  RULESET_BY_FILENAME: (fileName: string) =>
    `${API_BASE_URL}/api/boardgame/rulesets/filename/${fileName}`,
  RULESETS_BY_EXTENSION: (fileExt: string) =>
    `${API_BASE_URL}/api/boardgame/rulesets/extension/${fileExt}`,
} as const;

export default API_BASE_URL;
