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
      to: "/story-generator/view/$storyId",
      params: { storyId: story.id.toString() },
    });
  };

  const handleEditStory = () => {
    navigate({
      to: "/story-generator/edit/$storyId",
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
    <div className="bg-black border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* Cover Image */}
      {story.coverImageUrl && (
        <div className="mb-4">
          <img
            src={story.coverImageUrl}
            alt={`${story.hero} story cover`}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Story Info */}
      <div className="space-y-3">
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
          <div className="flex gap-2 pt-3 border-t border-gray-600">
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
  );
};
