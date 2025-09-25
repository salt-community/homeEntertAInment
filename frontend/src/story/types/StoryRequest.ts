export const Theme = {
  ADVENTURE: "ADVENTURE",
  SCI_FI: "SCI_FI",
  MYSTERY: "MYSTERY",
  ROMANCE: "ROMANCE",
  EDUCATIONAL: "EDUCATIONAL",
  HISTORY: "HISTORY",
  COMEDY: "COMEDY",
  FANTASY: "FANTASY",
  DRAMA: "DRAMA",
} as const;

export const AgeGroup = {
  AGE_3_4: "AGE_3_4",
  AGE_5_6: "AGE_5_6",
  AGE_7_8: "AGE_7_8",
  AGE_9_10: "AGE_9_10",
  AGE_11_12: "AGE_11_12",
} as const;

export const Twist = {
  SECRET_DOOR: "SECRET_DOOR",
  TALKING_ANIMAL: "TALKING_ANIMAL",
  HIDDEN_TREASURE: "HIDDEN_TREASURE",
  MAGIC_SPELL: "MAGIC_SPELL",
  UNEXPECTED_ALLY: "UNEXPECTED_ALLY",
  LOST_AND_FOUND: "LOST_AND_FOUND",
  TIME_TRAVEL: "TIME_TRAVEL",
  DREAM_OR_REALITY: "DREAM_OR_REALITY",
  DISGUISED_HERO: "DISGUISED_HERO",
  FRIEND_TURNS_VILLAIN: "FRIEND_TURNS_VILLAIN",
  MAP_TO_ANOTHER_WORLD: "MAP_TO_ANOTHER_WORLD",
  WISH_COMES_TRUE: "WISH_COMES_TRUE",
} as const;

export const StoryLength = {
  SHORT: "SHORT",
  MEDIUM: "MEDIUM",
  FULL: "FULL",
} as const;

export type ThemeValue = (typeof Theme)[keyof typeof Theme];
export type AgeGroupValue = (typeof AgeGroup)[keyof typeof AgeGroup];
export type TwistValue = (typeof Twist)[keyof typeof Twist];
export type StoryLengthValue = (typeof StoryLength)[keyof typeof StoryLength];

export interface StoryRequest {
  character: string;
  theme: ThemeValue[];
  ageGroup: AgeGroupValue;
  twist?: TwistValue;
  custom?: string;
  storyLength?: StoryLengthValue;
}
