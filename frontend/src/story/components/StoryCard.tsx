import React from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Story } from "../types";

interface StoryCardProps {
  story: Story;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onDelete,
  showActions = true,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewStory = () => {
    navigate({
      to: "/story/view/$storyId",
      params: { storyId: story.id.toString() },
    });
  };

  // Edit action removed for saved cards

  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this story?")
    ) {
      onDelete(story.id);
    }
  };

  return (
    <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9] h-full">
      <div className="rounded-[10px] bg-black p-6 shadow-md hover:shadow-lg transition-all duration-200 h-full min-h-[300px] flex flex-col">
        {/* Story Info */}
        <div className="space-y-3 flex-1">
          <div>
            <h3 className="text-xl font-semibold text-white line-clamp-2">
              {story.hero}
            </h3>
          </div>

          {/* Story Preview: first 3 sentences */}
          <div className="text-white/80 text-sm line-clamp-4">
            {(() => {
              const normalized = story.content
                .replace(/#{1,6}\s+/g, "")
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .replace(/\*(.*?)\*/g, "$1")
                .replace(/`(.*?)`/g, "$1")
                .replace(/\[(.*?)\]\(.*?\)/g, "$1")
                .replace(/\s+/g, " ")
                .trim();
              const sentences = normalized.split(/(?<=[.!?])\s+/);
              const preview = sentences.slice(0, 3).join(" ");
              return preview || normalized.substring(0, 150);
            })()}
          </div>

          {/* Metadata */}
          <div className="flex justify-between items-center text-xs text-white/60">
            <span>Created: {formatDate(story.createdAt)}</span>
            {story.userName && <span>By: {story.userName}</span>}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-3 border-t border-gray-600 mt-4">
              <button
                onClick={handleViewStory}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                View Story
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
