export interface Story {
  id: string;
  hero: string;
  theme: string;
  tone: string;
  twist: string;
  content: string;
  coverImageUrl?: string;
  userId: string;
  userName?: string;
  createdAt: string;
}

export interface CreateStoryRequest {
  hero: string;
  theme: string;
  tone: string;
  twist: string;
  content: string;
  coverImageUrl?: string;
}

export interface UpdateStoryRequest {
  id: string;
  hero?: string;
  theme?: string;
  tone?: string;
  twist?: string;
  content?: string;
  coverImageUrl?: string;
}
