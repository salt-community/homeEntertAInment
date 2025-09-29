interface StoryAnalysis {
  title: string;
  mainCharacter: string;
  setting: string;
  theme: string;
  mood: string;
  keyElements: string[];
}

/**
 * Analyzes a generated story and extracts key elements for cover image generation
 */
export function analyzeStory(
  story: string,
  originalCharacter: string
): StoryAnalysis {
  // Extract title (usually the first line with #)
  const titleMatch = story.match(/^#\s+(.+)$/m);
  const title = titleMatch
    ? titleMatch[1].trim()
    : `${originalCharacter} and the Adventure`;

  // Extract main character (use original character or try to find in story)
  const mainCharacter = originalCharacter;

  // Try to extract setting from story content
  const setting = extractSetting(story);

  // Try to determine theme/mood from content
  const theme = extractTheme(story);
  const mood = extractMood(story);

  // Extract key visual elements
  const keyElements = extractKeyElements(story);

  return {
    title,
    mainCharacter,
    setting,
    theme,
    mood,
    keyElements,
  };
}

/**
 * Extracts setting information from the story
 */
function extractSetting(story: string): string {
  const lowerStory = story.toLowerCase();

  // Common setting keywords
  const settings = [
    {
      keywords: ["forest", "woods", "tree", "trees"],
      setting: "enchanted forest",
    },
    { keywords: ["castle", "palace", "kingdom"], setting: "majestic castle" },
    { keywords: ["ocean", "sea", "beach", "waves"], setting: "ocean shore" },
    { keywords: ["mountain", "hill", "peak"], setting: "mountain landscape" },
    { keywords: ["garden", "flower", "meadow"], setting: "colorful garden" },
    { keywords: ["cave", "tunnel", "underground"], setting: "mysterious cave" },
    { keywords: ["village", "town", "city"], setting: "charming village" },
    { keywords: ["sky", "cloud", "stars", "moon"], setting: "starry sky" },
  ];

  for (const { keywords, setting } of settings) {
    if (keywords.some((keyword) => lowerStory.includes(keyword))) {
      return setting;
    }
  }

  return "magical world";
}

/**
 * Extracts theme from story content
 */
function extractTheme(story: string): string {
  const lowerStory = story.toLowerCase();

  if (
    lowerStory.includes("adventure") ||
    lowerStory.includes("journey") ||
    lowerStory.includes("quest")
  ) {
    return "adventure";
  }
  if (lowerStory.includes("friendship") || lowerStory.includes("friend")) {
    return "friendship";
  }
  if (
    lowerStory.includes("magic") ||
    lowerStory.includes("spell") ||
    lowerStory.includes("wizard")
  ) {
    return "magic";
  }
  if (
    lowerStory.includes("treasure") ||
    lowerStory.includes("gold") ||
    lowerStory.includes("jewel")
  ) {
    return "treasure hunt";
  }
  if (lowerStory.includes("animal") || lowerStory.includes("creature")) {
    return "animal tale";
  }

  return "adventure";
}

/**
 * Extracts mood/atmosphere from story
 */
function extractMood(story: string): string {
  const lowerStory = story.toLowerCase();

  const positiveWords = [
    "happy",
    "joy",
    "laugh",
    "smile",
    "bright",
    "cheerful",
    "wonderful",
  ];
  const mysteriousWords = [
    "secret",
    "mystery",
    "hidden",
    "magical",
    "mysterious",
  ];
  const excitingWords = [
    "exciting",
    "thrilling",
    "adventure",
    "journey",
    "quest",
  ];

  if (positiveWords.some((word) => lowerStory.includes(word))) {
    return "bright and cheerful";
  }
  if (mysteriousWords.some((word) => lowerStory.includes(word))) {
    return "mysterious and magical";
  }
  if (excitingWords.some((word) => lowerStory.includes(word))) {
    return "exciting and adventurous";
  }

  return "warm and inviting";
}

/**
 * Extracts key visual elements from the story
 */
function extractKeyElements(story: string): string[] {
  const elements: string[] = [];
  const lowerStory = story.toLowerCase();

  // Character types
  if (lowerStory.includes("rabbit") || lowerStory.includes("bunny"))
    elements.push("cute rabbit");
  if (lowerStory.includes("cat")) elements.push("friendly cat");
  if (lowerStory.includes("dog")) elements.push("loyal dog");
  if (lowerStory.includes("bird")) elements.push("colorful bird");
  if (lowerStory.includes("bear")) elements.push("gentle bear");
  if (lowerStory.includes("dragon")) elements.push("friendly dragon");
  if (lowerStory.includes("fairy")) elements.push("sparkling fairy");
  if (lowerStory.includes("princess") || lowerStory.includes("prince"))
    elements.push("royal character");

  // Objects and items
  if (lowerStory.includes("book")) elements.push("open book");
  if (lowerStory.includes("key")) elements.push("golden key");
  if (lowerStory.includes("crown")) elements.push("shining crown");
  if (lowerStory.includes("flower") || lowerStory.includes("bloom"))
    elements.push("beautiful flowers");
  if (lowerStory.includes("star")) elements.push("twinkling stars");
  if (lowerStory.includes("rainbow")) elements.push("vibrant rainbow");
  if (lowerStory.includes("butterfly")) elements.push("graceful butterflies");

  // Limit to top 3 most relevant elements
  return elements.slice(0, 3);
}

/**
 * Generates a dynamic cover image prompt based on story analysis
 */
export function generateCoverImagePrompt(
  story: string,
  originalCharacter: string
): string {
  const analysis = analyzeStory(story, originalCharacter);

  const elementsText =
    analysis.keyElements.length > 0
      ? ` featuring ${analysis.keyElements.join(", ")}`
      : "";

  const prompt = `A beautiful children's book cover${elementsText}. The scene shows ${analysis.mainCharacter} in a ${analysis.setting}. The artwork captures a ${analysis.mood} atmosphere with a ${analysis.theme} theme. The cover should include the title "${analysis.title}" prominently displayed in elegant, readable text. Style: colorful, whimsical illustration with vibrant colors, suitable for children's literature. The artwork should be detailed, engaging, and convey the magical adventure within.`;

  return prompt;
}
