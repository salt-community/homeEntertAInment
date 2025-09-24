import React from "react";
import ReactMarkdown from "react-markdown";

interface StoryViewerProps {
  /** The markdown content to render */
  markdown: string;
}

/**
 * A reusable component for rendering markdown content with Tailwind Typography styling.
 *
 * @example
 * ```tsx
 * <StoryViewer markdown="# Hello World\n\nThis is **bold** text." />
 * ```
 */
export const StoryViewer: React.FC<StoryViewerProps> = ({ markdown }) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};
