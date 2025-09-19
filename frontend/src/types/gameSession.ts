/**
 * All types related to game sessions
 */

export interface Player {
  id: number;
  playerName: string;
  createdAt: string;
  session?: Session;
}

export interface RuleSet {
  id: number;
  fileName: string;
  fileExt?: string;
  fileSize?: number;
  codedData?: string;
  decodedData?: string;
  createdAt: string;
}

export interface Session {
  id: number;
  sessionId: string;
  gameName: string;
  gameState?: string;
  players: Player[];
  isActive: boolean;
  createdAt: string;
  metadata?: string;
  ruleSet?: RuleSet;
}

export interface CreateSessionRequest {
  gameName: string;
  userId?: string;
}

export interface SessionResponse {
  sessions: Session[];
  total: number;
}
