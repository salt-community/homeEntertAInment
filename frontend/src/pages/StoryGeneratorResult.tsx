import { useEffect, useMemo, useRef } from "react";
import { useGenerateStory, useGenerateImage } from "../story/hooks";
import { StoryViewer, SaveToPdfButton } from "../story/components";
import type { StoryRequest } from "../story/types";
import { Link } from "@tanstack/react-router";
import { generateCoverImagePrompt } from "../story/utils/storyAnalyzer";

export default function StoryGeneratorResult() {
  const hasStartedRef = useRef(false);
  const { data, loading, error, submit } = useGenerateStory();
  const {
    data: imageData,
    loading: imageLoading,
    error: imageError,
    submit: generateImage,
  } = useGenerateImage();

  const request: StoryRequest | null = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("storyRequest");
      return raw ? (JSON.parse(raw) as StoryRequest) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!hasStartedRef.current && request) {
      hasStartedRef.current = true;
      void submit(request).finally(() => {
        sessionStorage.removeItem("storyRequest");
      });
    }
  }, [request, submit]);

  const handleGenerateCoverImage = async () => {
    if (!data?.story || !request) return;

    // Generate dynamic prompt based on the actual story content
    const description = generateCoverImagePrompt(data.story, request.character);

    console.log("Generated dynamic cover image prompt:", description);

    try {
      await generateImage({ description });
    } catch (err) {
      console.error("Failed to generate cover image:", err);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-6">
      <div className="w-full max-w-2xl flex justify-end">
        <Link
          to="/story-generator"
          className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white !text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span className="text-white">Generate new story</span>
        </Link>
      </div>
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold">Story Result</h2>
        <p className="text-sm text-gray-600">
          Your generated story will appear below.
        </p>
      </div>

      {!request && (
        <div className="w-full max-w-2xl text-center">
          <p className="text-gray-700">No request found.</p>
          <Link to="/story-generator" className="text-indigo-600 underline">
            Go back to Story Generator
          </Link>
        </div>
      )}

      {loading && (
        <div className="w-full max-w-2xl flex flex-col items-center space-y-3 py-8">
          <GradientSpinner />
          <p className="text-sm text-gray-600">Generating your story...</p>
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl">
          <p className="text-red-600">{error}</p>
          <Link to="/story-generator" className="text-indigo-600 underline">
            Try again
          </Link>
        </div>
      )}

      {data?.story && (
        <div className="w-full max-w-2xl">
          <h3 className="text-xl font-medium mb-2">Result</h3>

          {/* Action Buttons */}
          <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={handleGenerateCoverImage}
              disabled={imageLoading}
              className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {imageLoading ? (
                <>
                  <GradientSpinner />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                "Generate Cover Image"
              )}
            </button>

            <SaveToPdfButton
              storyMarkdown={data.story}
              coverImageUrl={imageData?.imageUrl}
            />
          </div>

          {/* Image Error Display */}
          {imageError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                Failed to generate cover image: {imageError}
              </p>
            </div>
          )}

          {/* Cover Image Display */}
          {imageData?.imageUrl && (
            <div className="mb-6 flex justify-center">
              <img
                src={imageData.imageUrl}
                alt="Story cover"
                className="max-w-full h-auto rounded-lg shadow-lg border"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}

          {/* Story Content */}
          <div className="border rounded p-4 shadow-sm">
            <StoryViewer markdown={data.story} />
          </div>
        </div>
      )}
    </div>
  );
}

function GradientSpinner() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
