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

  const handleEditStory = () => {
    // Edit functionality not implemented yet
    navigate({
      to: "/story/view/$storyId",
      params: { storyId: story.id.toString() },
    });
  };

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
      <div className="rounded-[10px] bg-black p-6 shadow-md hover:shadow-lg transition-all duration-200 h-full min-h-[420px] flex flex-col">
        {/* Cover Image (reserve consistent space) */}
        <div className="mb-4 h-48 w-full">
          {story.coverImageUrl ? (
            <img
              src={story.coverImageUrl}
              alt={`${story.hero} story cover`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-xs text-white/50">
              No cover image
            </div>
          )}
        </div>

        {/* Story Info */}
        <div className="space-y-3 flex-1">
          <div>
            <h3 className="text-xl font-semibold text-white line-clamp-2">
              {story.hero}
            </h3>
            <p className="text-sm text-white/80 mt-1">
              Theme: {story.theme} • Tone: {story.tone}
            </p>
            {story.twist && (
              <p className="text-sm text-white/80">Twist: {story.twist}</p>
            )}
          </div>

          {/* Story Preview */}
          <div className="text-white/70 text-sm line-clamp-3">
            {story.content
              .replace(/#{1,6}\s+/g, "") // Remove markdown headers
              .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
              .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
              .replace(/`(.*?)`/g, "$1") // Remove inline code markdown
              .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove link markdown, keep text
              .substring(0, 150)}
            ...
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
                onClick={handleEditStory}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                Edit
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
